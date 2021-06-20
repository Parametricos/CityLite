import Viewer from "../viewer";
import Model from "./Model";
import {makeAutoObservable} from "mobx";

export default class ModelManager {

    viewer: Viewer;
    models: Model[] = []

    constructor(viewer: Viewer) {
        this.viewer = viewer;
        makeAutoObservable(this)

    }

    addModel(model: Model){
        this.viewer.map.mapAnchors.add(model.mapAnchor);
        this.viewer.map.lookAt({
            target: model.geoPosition,
            tilt: 60,
            zoomLevel: 19
        })
        this.models.push(model)
    }
}