import DataSourceProperty from "./DataSourceProperty";

export default class NumberDataSourceProperty extends DataSourceProperty{

    private minRange: number = 0;
    private maxRange: number = 0;

    get MinRange(): number {
        return this.minRange;
    }

    get MaxRange(): number {
        return this.maxRange;
    }

    setMinRange (range: number) {
        if(range < this.maxRange) this.minRange = range;
        else throw (new Error("Minimum range cannot be larger than maximum range."))
    }

    setMaxRange (range: number) {
        if(range > this.minRange) this.maxRange = range;
        else throw (new Error("Maximum range cannot be smaller than minimum range."))
    }

    expandRange (range: number) {
        if(range < this.minRange) this.minRange = range;
        else if(range > this.maxRange) this.maxRange = range;
    }
}