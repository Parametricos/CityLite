import { makeAutoObservable } from "mobx";
import { Theme } from "@here/harp-datasource-protocol";
import {MapAnchor, MapView, CopyrightElementHandler} from "@here/harp-mapview";
import {VectorTileDataSource} from "@here/harp-vectortile-datasource";
import {GeoCoordinates} from "@here/harp-geoutils";
import {MapControls, MapControlsUI} from "@here/harp-map-controls";
import {IFCLoader} from "web-ifc-three/IFCLoader";
import Sun from "./Sun";
import LayerManager from "./layers/LayerManager";
import ModelManager from "./models/ModelManager";

class Viewer {

    map: MapView;
    sun!: Sun;
    layer_manager: LayerManager;
    model_manager: ModelManager;
    loading: boolean = true;
    tab: number = 0;
    resource_url = "https://cassini-hackathon-resources.s3.eu-central-1.amazonaws.com"


    referencePosition: GeoCoordinates =  new GeoCoordinates(37.78978459667242, -122.3932013251831)

    dataSourcesOpen: boolean = false;
    modelsOpen: boolean = false;

    constructor(canvas: HTMLCanvasElement){
        makeAutoObservable(this);


        const theme: Theme = {
            extends: `${this.resource_url}/resources/berlin_tilezen_base.json`,
            lights: [
                {
                    type: "ambient",
                    color: "#ffffff",
                    name: "ambientLight",
                    intensity: 0.9
                },
                {
                    type: "directional",
                    color: "#ffffff",
                    name: "light1",
                    intensity: 1,
                    // Will be overriden immediately, see `update`
                    direction: {
                        x: 2,
                        y: 1,
                        z: -1
                    },
                    castShadow: true
                }
            ],
            definitions: {
                // Opaque buildings
                defaultBuildingColor: { value: "#EDE7E1FF" }
            },

        };

        const map = new MapView({
            canvas,
            theme,
            target: this.referencePosition,
            zoomLevel: 16,
            enableShadows: true
        });

        CopyrightElementHandler.install("copyrightNotice", map);
        
        this.map = map;
        window.onresize = () => map.resize(window.innerWidth, window.innerHeight);

        this.layer_manager = new LayerManager(this, theme)
        this.model_manager = new ModelManager(this)
    }

    async init() {

        //Add controls
        const controls = new MapControls(this.map);
        controls.maxTiltAngle = 75;
        controls.maxZoomLevel = 200;
        const ui = new MapControlsUI(controls, { zoomLevel: "input" });
        this.map.canvas.parentElement!.appendChild(ui.domElement);

        const vectorDataSource = new VectorTileDataSource({
            baseUrl: "https://vector.hereapi.com/v2/vectortiles/base/mc",
            authenticationCode: "v9WQyTddCM6_Ci01LdaZ0maCoGZPFI3sxCul3svb59Q"
        });

        await this.map.addDataSource(vectorDataSource)

        this.sun = new Sun(this);

        this.loading = false;
    }

    async setThemeStyles (style: any) {
        const theme: Theme = {
            extends: "resources/berlin_tilezen_base.json",
            lights: [
                {
                    type: "ambient",
                    color: "#ffffff",
                    name: "ambientLight",
                    intensity: 0.9
                },
                {
                    type: "directional",
                    color: "#ffffff",
                    name: "light1",
                    intensity: 1,
                    // Will be overriden immediately, see `update`
                    direction: {
                        x: 2,
                        y: 1,
                        z: -1
                    },
                    castShadow: true
                }
            ],
            definitions: {
                // Opaque buildings
                defaultBuildingColor: { value: "#EDE7E1FF" }
            },
            styles: style
        };
        await this.map.setTheme(theme)
    }
}

export default Viewer;
