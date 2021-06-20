import {StyleSet} from "@here/harp-datasource-protocol";
import DataSource from "./DataSource";
import { makeAutoObservable,} from "mobx";
import {FeaturesDataSource} from "@here/harp-features-datasource";
import Color from "./Color";
import {MapView} from "@here/harp-mapview";

export interface GeoJsonLayerOptions {
    fill: boolean,
    fill_color: Color
    fill_opacity: number

    stroke: boolean,
    stroke_color: Color
    stroke_width: number,
    stroke_opacity: number

    point: boolean,
    point_color: Color,
    point_opacity: number
}

export default class GeoJsonLayer {

    id: string;
    name: string;
    isEnabled: boolean = true;
    mapView: MapView;

    datasource: DataSource;
    harpDataSource: FeaturesDataSource | undefined;

    options: GeoJsonLayerOptions;
    decoderUrl: string;

    constructor(id: string, name: string, datasource: DataSource, mapView: MapView,  options: GeoJsonLayerOptions) {

        this.decoderUrl = window.location.origin + "/decoder.bundle.js"

        this.options = options;

        makeAutoObservable(this);

        this.mapView = mapView;
        this.id = id;
        this.name = name;
        this.datasource = datasource

        mapView.setDynamicProperty(`${id}-fill`, this.options.fill)
        mapView.setDynamicProperty(`${id}-fill_color`, this.options.fill_color.hex)

        mapView.setDynamicProperty(`${id}-stroke`, this.options.stroke);
        mapView.setDynamicProperty(`${id}-stroke_width`, this.options.stroke_width);
        mapView.setDynamicProperty(`${id}-stroke_color`, this.options.stroke_color.hex);

        mapView.setDynamicProperty(`${id}-point`, this.options.point);
        mapView.setDynamicProperty(`${id}-point_color`, this.options.point_color.hex);

    }

    set DataSource (dataSource: DataSource){
        if(this.datasource && this.harpDataSource) this.harpDataSource.setFromGeojson(dataSource.data)
    }

    get harpFeaturesDataSource() {
        if(!this.datasource) return console.error("Datasource is not loaded properly.")
        if(!this.harpDataSource) {
            this.harpDataSource =
                new FeaturesDataSource(
                {
                    gatherFeatureAttributes: true,
                    name: this.name,
                    styleSetName: this.id,
                    workerTilerUrl: this.decoderUrl,
                    concurrentDecoderScriptUrl: this.decoderUrl
                }
            );
            this.harpDataSource.setFromGeojson(this.datasource.getData());
            return this.harpDataSource;
        }else {
            return this.harpDataSource;
        }
    }

    get stroke_width(){
        return this.options.stroke_width;
    }

    set stroke_width(width: number){
        this.options.stroke_width = width;
        this.mapView.setDynamicProperty(`${this.id}-stroke_width`, this.options.stroke_width);
    }

    set stroke_color(color: Color){
        this.options.stroke_color = color;
        this.options.stroke_opacity = color.A;

        this.mapView.setDynamicProperty(`${this.id}-stroke_color`, this.options.stroke_color.hex);
        this.mapView.setDynamicProperty(`${this.id}-stroke_opacity`, this.options.stroke_opacity);
    }

    get stroke_color(){
        return this.options.stroke_color;
    }

    set stroke(enabled: boolean){
        this.options.stroke = enabled;
        this.mapView.setDynamicProperty(`${this.id}-stroke`, this.options.stroke);
    }

    get stroke(){
        return this.options.stroke;
    }

    get fill(){
        return this.options.fill;
    }

    set fill(enabled: boolean){
        this.options.fill = enabled;
        this.mapView.setDynamicProperty(`${this.id}-fill`, this.options.fill);
    }

    set fill_color(color: Color){
        this.options.fill_color = color;
        this.options.fill_opacity = color.A;
        this.mapView.setDynamicProperty(`${this.id}-fill_color`, this.options.fill_color.hex);
        this.mapView.setDynamicProperty(`${this.id}-fill_opacity`, this.options.fill_opacity);
    }

    get fill_color(){
        return this.options.fill_color;
    }

    //Points
    get points(){
        return this.options.point;
    }

    set points(enabled: boolean){
        this.options.point = enabled;
        this.mapView.setDynamicProperty(`${this.id}-point`, this.options.point);
    }

    set point_color(color: Color){
        this.options.point_color = color;
        this.options.point_opacity = color.A;
        this.mapView.setDynamicProperty(`${this.id}-point_color`, this.options.point_color.hex);
        this.mapView.setDynamicProperty(`${this.id}-point_opacity`, this.options.point_opacity);
    }

    get point_color(){
        return this.options.point_color;
    }

    set enabled(value: boolean){
        if(this.harpDataSource){
            this.isEnabled = value;
            this.harpDataSource.enabled = value;
            this.mapView.update()
        }
    }

    get enabled(){
        return this.isEnabled;
    }

    get styleSet(): StyleSet {
        return [
            {
                when: "$geometryType == 'polygon'",
                technique: "fill",
                renderOrder: 10000,
                enabled: ["get", `${this.id}-fill`, ["dynamic-properties"]],
                attr: {
                    color: ["get", `${this.id}-fill_color`, ["dynamic-properties"]],
                    transparent: true,
                    opacity: ["get", `${this.id}-fill_opacity`, ["dynamic-properties"]],
                }
            },
            {
                when: "$geometryType == 'polygon'",
                technique: "solid-line",
                renderOrder: 10001,
                enabled: ["get", `${this.id}-stroke`, ["dynamic-properties"]],
                attr: {
                    color: ["get", `${this.id}-stroke_color`, ["dynamic-properties"]],
                    opacity: ["get", `${this.id}-stroke_opacity`, ["dynamic-properties"]],
                    metricUnit: "Pixel",
                    lineWidth: ["get", `${this.id}-stroke_width`, ["dynamic-properties"]]
                }
            },
            {
                when: "$geometryType == 'point'",
                technique: "circles",
                renderOrder: 10002,
                enabled: ["get", `${this.id}-point`, ["dynamic-properties"]],
                attr: {
                    size: 10,
                    color: ["get", `${this.id}-point_color`, ["dynamic-properties"]]
                }
            },
            {
                when: "$geometryType == 'line'",
                technique: "solid-line",
                enabled: ["get", `${this.id}-stroke`, ["dynamic-properties"]],
                renderOrder: 10000,
                attr: {
                    color: ["get", `${this.id}-stroke_color`, ["dynamic-properties"]],
                    metricUnit: "Pixel",
                    lineWidth: ["get", `${this.id}-stroke_width`, ["dynamic-properties"]]
                }
            }
        ];
    }
}