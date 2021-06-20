import {MapAnchor} from "@here/harp-mapview";
import {IFCLoader} from "web-ifc-three/IFCLoader";
import {GeoCoordinates} from "@here/harp-geoutils";
import {nanoid} from "nanoid";
import {clamp} from "../../utils/math";
import {makeAutoObservable} from "mobx";

export type ModelType = "ifc" | "glb"

export default class Model {

    id: string
    name: string
    type: ModelType = "ifc";
    anchor: MapAnchor | undefined;
    geoPosition: GeoCoordinates
    loaded: boolean = false;
    isEnabled: boolean = true;

    constructor(name: string, geoPosition: GeoCoordinates) {
        this.id = nanoid()
        this.name = name;
        this.geoPosition = geoPosition;
        makeAutoObservable(this)
    }

    async loadData(url: string, type: ModelType){
        switch (type){
            case "ifc": {
                const ifcLoader = new IFCLoader();
                ifcLoader.setWasmPath('../../../../');

                const ifc = await ifcLoader.loadAsync(url);

                ifc.receiveShadow = true;
                ifc.castShadow = true;

                const anchor = ifc as MapAnchor;
                anchor.rotateX(Math.PI / 2)
                anchor.renderOrder = 1000
                anchor.geoPosition = this.geoPosition;

                this.anchor = anchor;

                this.loaded = true;
            }
        }
    }

    get mapAnchor(){
        if(!this.anchor)
            throw new Error("Model not loaded.")
        return this.anchor;
    }

    set enabled(state: boolean){
        this.mapAnchor.visible = state;
        this.isEnabled = state;
    }

    get enabled(){
        return this.isEnabled;
    }

    set latitude(lat: number){
        const latitude = clamp(lat, -90, 90);
        this.geoPosition = new GeoCoordinates(latitude, this.geoPosition.longitude)
        this.mapAnchor.geoPosition = this.geoPosition;
    }

    get latitude(){
        return this.geoPosition.latitude;
    }

    set longitude(long: number){
        const longitude = clamp(long, -180, 180);
        this.geoPosition = new GeoCoordinates(this.geoPosition.latitude, longitude)
        this.mapAnchor.geoPosition = this.geoPosition;
    }

    get longitude(){
        return this.geoPosition.longitude;
    }

}