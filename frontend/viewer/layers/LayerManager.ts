import GeoJsonLayer from "./GeoJsonLayer";
import {Theme} from "@here/harp-datasource-protocol";
import {MapView} from "@here/harp-mapview";
import {makeAutoObservable, reaction, toJS} from "mobx";
import DataSource from "./DataSource";
import Viewer from "../viewer";
import localforage from "localforage";
import {DataSourceTypes} from "./DataSourceTypes";

const resource_url = "https://cassini-hackathon-resources.s3.eu-central-1.amazonaws.com"

const DemoData = [
    {
        name: "San Francisco Neighborhoods",
        id: "san_francisco_neighborhoods",
        type: "geojson",
        updated: "18 June 2021",
        url: `${resource_url}/layers/san_francisco_neighborhoods.json`
    },
    {
        name: "Limassol NDVI",
        id: "limassol_ndvi",
        type: "geojson",
        updated: "18 June 2021",
        url: `${resource_url}/layers/limassol_ndvi.geojson`
    },
    {
        name: "Cyprus Fire Emergency 2021.07.02",
        id: "cyprusfire_20210703",
        type: "geojson",
        updated: "03 July 2021",
        url: `https://raw.githubusercontent.com/Parametricos/citylite-smartcities-cassini-hackathon-2021/main/assets/layers/2021_CyprusFire-EPSG.geojson`
    },
    /*{
        id: "limassol_boundary_buildings",
        name: "Limassol Boundary Buildings",
        type: "geojson",
        url: `${resource_url}/layers/limassol_boundary_buildings.geojson`
    }*/
]

export default class LayerManager {

    viewer: Viewer;
    map: MapView
    theme: Theme;

    dataSources: DataSource[] = []
    layers: GeoJsonLayer[] = []

    constructor(viewer: Viewer, theme: Theme) {
        this.viewer = viewer;
        this.map = viewer.map;
        this.theme = theme;
        makeAutoObservable(this)
        this.loadCachedDataSources()
        this.loadDemoDataSources()
    }

    async addLayer(layer: GeoJsonLayer){

        this.layers.push(layer);

        const styles : any = {};
        this.layers.forEach((layer) => {
            styles[layer.id] = layer.styleSet;
        })

        await this.viewer.setThemeStyles(styles)

        const datasource = layer.harpFeaturesDataSource;
        if(!datasource) return console.log('datasource is not loaded properly.');

        await this.map.addDataSource(datasource);
        return layer;
    }

    removeLayer(layer: GeoJsonLayer) : void {

        const datasource = layer.harpFeaturesDataSource;
        if(!datasource) return console.log('datasource is not loaded properly.');

        this.map.removeDataSource(datasource);

        const index = this.layers.indexOf(layer, 0);
        if (index > -1) {
            this.layers.splice(index, 1);
        }
    }

    getDatasource (id: string) {
        return this.dataSources.find((x) => x.id === id);
    }

    async loadDemoDataSources(){
        for(let i = 0; i < DemoData.length; i++){
            try {
                const demo = DemoData[i];
                const response = await fetch(demo.url);

                const datasource = new DataSource(demo.id, demo.name, demo.type as DataSourceTypes);
                datasource.cachable = false;
                datasource.demo = true;

                await datasource.setData(await response.json())
                this.dataSources.push(datasource)
            }catch (e) {
                console.log("Error loading demo data")
                console.error(e);
            }
        }
    }


    async loadCachedDataSources(){
        localforage.iterate((value: any, key, iterationNumber) => {
            if(key.startsWith("datasource")){
                const datasource = new DataSource(value.id, value.name, value.type);
                datasource.features = value.features;
                datasource.properties = value.properties;
                datasource.data = {
                    type: "FeatureCollection",
                    features: value.features
                }
                datasource.loaded = true;
                this.dataSources.push(datasource)
            }
        }).then(function() {
            console.log('Loading cached data sources has completed');
        }).catch(function(err) {
            console.log("An error occurred loading a cached data source.")
            console.error(err);
        });
    }

    async deleteDataSource(id: string){
        const match = this.dataSources.findIndex((x) => x.id === id);
        await localforage.removeItem(`datasource-${id}`);
        this.dataSources.splice(match, 1);
    }
}