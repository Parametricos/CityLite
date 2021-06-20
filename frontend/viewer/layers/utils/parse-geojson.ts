import DataSourceProperty from "../DataSourceProperty";
import StringDataSourceProperty from "../StringDataSourceProperty";
import NumberDataSourceProperty from "../NumberDataSourceProperty";

export default function Parse(geojson: any) : { properties: DataSourceProperty[], features: object[]} {

    if(typeof geojson === 'string') geojson = JSON.parse(geojson);

    if(geojson.type === 'FeatureCollection'){
        return iterateCollection(geojson);
    }else{
        console.log('no feature collection')
    }

    return { properties: [], features: []}
}

function iterateCollection(geojson: any) {

    const properties: DataSourceProperty[] =  [];

    const features: any[] = [];

    geojson.features.forEach((feature: any) =>{
        features.push(feature);

        for(let key in feature.properties){
            if(feature.properties.hasOwnProperty(key)){
                const existingProperty = properties.find((property) => property.name === key);
                const value  = feature.properties[key];

                switch (typeof value) {
                    case "undefined":
                        break;
                    case "object":
                        break;
                    case "boolean":
                        break;
                    case "number":{
                        if(!existingProperty){
                            const property = new NumberDataSourceProperty(key);
                            property.expandRange(feature.properties[key]);
                            properties.push(property);

                        }else{
                            (existingProperty as NumberDataSourceProperty).expandRange(feature.properties[key])
                        }
                        break;
                    }
                    case "function":
                        break;
                    case "symbol":
                        break;
                    case "bigint":
                        break;
                    case "string": {
                        if(!existingProperty) {
                            const property = new StringDataSourceProperty(key);
                            properties.push(property);
                        }
                        break;
                    }
                }
            }
        }
    });
    return { features: features, properties: properties}
}