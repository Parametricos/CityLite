import Viewer from './viewer'
import * as THREE from 'three';
import {MapView, MapViewEventNames} from "@here/harp-mapview";
import {makeAutoObservable} from "mobx";
import SunCalc from "suncalc";


const FADE_DURATION = 30 * 60 * 1000; // in ms
const COLOR_CHANGE_DURATION = 2 * FADE_DURATION; // in ms
const TOTAL_FADE_DURATION = FADE_DURATION + COLOR_CHANGE_DURATION;
const COLOR_INTENSITY_FACTOR = 1.5;
const SUNRISE_COLOR = new THREE.Color("hsl(45, 100%, 75%)");
const SUNSET_COLOR = new THREE.Color("hsl(30, 100%, 60%)");
const MAIN_SUN_COLOR = new THREE.Color();

export default class Sun {

    viewer: Viewer;
    map: MapView;
    sun: THREE.DirectionalLight;
    private _date: Date;
    refSolarNoon: Date;
    refTime: number;
    MAX_SUN_INTENSITY: number;

    constructor(viewer: Viewer) {

        makeAutoObservable(this)

        this.viewer = viewer;

        const map = viewer.map;
        this.map = map;

        const date = new Date();
        this._date = date;

        // Reference solar noon time is used to calculate time offsets at specific coordinates.
        this.refSolarNoon = SunCalc.getTimes(date, 0, 0).solarNoon;
        // Main time offset.
        this.refTime = this.refSolarNoon.getTime() + date.getTimezoneOffset() * 60 * 1000;

        const light = map.lights.find(item => item instanceof THREE.DirectionalLight) as | THREE.DirectionalLight | undefined;

        if (light === undefined) {
            throw new Error("Light for a sun was not found.");
        }

        this.sun = light;

        // light.shadow.mapSize.width = 5120;
        // light.shadow.mapSize.height = 5120;
        // light.shadow.needsUpdate = true;

        this.MAX_SUN_INTENSITY = this.sun.intensity;
        MAIN_SUN_COLOR.copy(this.sun.color);


        this.update();

       /* window.setInterval(() => {
            const updated = this._date.add(1, 'second');
            this.date = updated.toDate();
        }, 1000)*/
    }

    update() {

        const map = this.map;
        const sun = this.sun;

        const { latitude, longitude } = this.viewer.referencePosition;
        const lightPos = sun.position;

        // Calculating time offset at current location.
        const timeOffset = SunCalc.getTimes(this.date, latitude, longitude).solarNoon.getTime() - this.refTime;
        // Time with corrected offset.
        const locationDate = new Date(this.date.getTime() + timeOffset);

        const sunTimes = SunCalc.getTimes(locationDate, latitude, longitude);
        const sunPosition = SunCalc.getPosition(locationDate, latitude, longitude);

        const azimuth = sunPosition.azimuth;
        const altitude = sunPosition.altitude - Math.PI / 2;

        const r = map.targetDistance;
        lightPos.setX(r * Math.sin(altitude) * Math.sin(azimuth));
        lightPos.setY(r * Math.sin(altitude) * Math.cos(azimuth));
        lightPos.setZ(r * Math.cos(altitude) - r);
        // Resetting the target is important, because this is overriden in the MapView.
        // This is an ugly hack and HARP-10353 should improve this.
        sun.target.position.set(0, 0, -r);

        sun.color.set(MAIN_SUN_COLOR);

        const location_ms = locationDate.getTime();
        const sunriseDiff = location_ms - sunTimes.sunriseEnd.getTime();
        const sunsetDiff = sunTimes.sunsetStart.getTime() - location_ms;
        if (sunriseDiff > 0 && sunsetDiff > 0) {
            if (sunriseDiff < TOTAL_FADE_DURATION || sunsetDiff < TOTAL_FADE_DURATION) {
                let color: THREE.Color;
                let colorDiff: number;
                if (azimuth < 0) {
                    color = SUNRISE_COLOR;
                    colorDiff = sunriseDiff;
                } else {
                    color = SUNSET_COLOR;
                    colorDiff = sunsetDiff;
                }
                sun.color.lerpHSL(
                    color,
                    THREE.MathUtils.clamp(1 - (colorDiff - FADE_DURATION) / COLOR_CHANGE_DURATION, 0, 1)
                );

                if (colorDiff <= FADE_DURATION) {
                    sun.intensity = THREE.MathUtils.lerp(
                        0,
                        this.MAX_SUN_INTENSITY * COLOR_INTENSITY_FACTOR,
                        colorDiff / FADE_DURATION
                    );
                } else {
                    sun.intensity = THREE.MathUtils.lerp(
                        this.MAX_SUN_INTENSITY,
                        this.MAX_SUN_INTENSITY * COLOR_INTENSITY_FACTOR,
                        THREE.MathUtils.clamp(
                            1 - (colorDiff - FADE_DURATION) / COLOR_CHANGE_DURATION,
                            0,
                            1
                        )
                    );
                }
            } else {
                sun.intensity = this.MAX_SUN_INTENSITY;
            }
        } else {
            sun.intensity = 0;
        }

        map.update();
    }

    set date(value: Date){
        this._date = value;
        this.update()
    }

    get date(){
        return this._date
    }
}