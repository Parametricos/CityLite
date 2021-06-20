export default class Color {

    private r: number = 0;
    private g: number = 0;
    private b: number = 0;
    private a: number = 0;

    constructor(r = 0, g = 0, b = 0, a = 0.6){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public randomise(){
        this.R = Color.randomRange(0, 255);
        this.G = Color.randomRange(0, 255);
        this.B = Color.randomRange(0, 255);
    }

    static Random(){
        return new Color(
            this.randomRange(0, 255),
            this.randomRange(0, 255),
            this.randomRange(0, 255)
        )
    }

    private static randomRange(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    get R () {
        return this.r;
    }

    set R (value: number){
        this.r = this.clamp(0, 255, value);
    }

    get G () {
        return this.g;
    }

    set G (value: number){
        this.g = this.clamp(0, 255, value);
    }

    get B () {
        return this.b;
    }

    set B (value: number){
        this.b = this.clamp(0, 255, value);
    }

    get A () {
        return this.a;
    }

    set A (value: number){
        this.a = this.clamp(0, 1, value);
    }

    clamp(min: number, max: number, value: number) {
        return Math.min(Math.max(value, min), max);
    };

    private rgbToHex = (rgb: number) => {
        let hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };

    get hex () : string {
        const red = this.rgbToHex(this.r);
        const green = this.rgbToHex(this.g);
        const blue = this.rgbToHex(this.b);
        const alpha = ((this.a * 255) | 1 << 8).toString(16).slice(1)
        return '#'+red+green+blue+alpha
    };

}