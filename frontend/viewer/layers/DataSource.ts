import * as shapefile from "shapefile";
import {DataSourceTypes} from "./DataSourceTypes";
import DataSourceProperty from "./DataSourceProperty";
import {makeAutoObservable, toJS} from "mobx";
import Parse from "./utils/parse-geojson";
import * as localforage from "localforage";

export default class DataSource {

    public id : string = '';
    public type : DataSourceTypes = "geojson"
    public name: string;
    public properties : DataSourceProperty[] = [];
    public features : object[] = [];
    public data: any;

    public cachable: boolean = true;
    public demo: boolean = false;

    loaded: boolean = false;
    isCached: boolean = false;

    constructor(id: string, name: string, type: DataSourceTypes){
        this.id = id;
        this.name = name;
        this.type = type;
        makeAutoObservable(this);
    }

    getData(){
        return toJS(this.data)
    }

    setData = async (data: any) => {
        if(!data) return;

        switch (this.type) {
            case "shp": {
                const source = await shapefile.read(data);

                const { properties, features} = Parse(source);
                this.properties = properties;
                this.features = features;
                this.data =
                    {
                        type: "FeatureCollection",
                        features: this.features
                    };
                await this.cache()

                break;
            }
            case "geojson":{

                if(data instanceof File){
                    const reader = new FileReader();
                    reader.onload = () => {
                        const data = reader.result;
                        const { properties, features} = Parse(data);
                        this.properties = properties;
                        this.features = features;
                        this.data =
                            {
                                type: "FeatureCollection",
                                features: this.features
                            };

                        if(this.cachable)
                            this.cache()

                    };
                    reader.readAsText(data);
                }else{
                    const { properties, features} = Parse(data);
                    this.properties = properties;
                    this.features = features;
                    this.data =
                        {
                            type: "FeatureCollection",
                            features: this.features
                        };

                    if(this.cachable)
                        this.cache()
                }
            }
        }
    }

    cache = async () => {
        await localforage.setItem(`datasource-${this.id}`, {
            id: this.id,
            name: this.name,
            type: this.type,
            features: toJS(this.features),
            properties: toJS(this.properties)
        })
    }
}