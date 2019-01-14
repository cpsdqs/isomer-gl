module.exports = class Color extends Float32Array {
    constructor (r, g, b, a) {
        super(4);

        if (Array.isArray(r)) {
            this.r = r[0];
            this.g = r[1];
            this.b = r[2];
            this.a = typeof r[3] === 'number' ? r[3] : 1;
        } else {
            this.r = r || 0;
            this.g = g || 0;
            this.b = b || 0;
            this.a = typeof a === 'number' ? a : 1;
        }
    }

    set r(v) {
        this[0] = v;
    }

    get r() {
        return this[0];
    }

    set g(v) {
        this[1] = v;
    }

    get g() {
        return this[1];
    }

    set b(v) {
        this[2] = v;
    }

    get b() {
        return this[2];
    }

    set a(v) {
        this[3] = v;
    }

    get a() {
        return this[3];
    }

    lighten (percentage, lightColor) {
        lightColor = lightColor || new Color(255, 255, 255);

        const newColor = Color.rgb2hsl(
            (lightColor.r / 255) * this.r,
            (lightColor.g / 255) * this.g,
            (lightColor.b / 255) * this.b,
        );

        newColor[2] = Math.max(0, Math.min(newColor[2] + percentage, 1));

        return new Color(Color.hsl2rgb(...newColor));
    }

    normalized () {
        return new Color(this.r / 255, this.g / 255, this.b / 255, this.a);
    }

    /**
     * Loads HSL values using the current RGB values
     * Converted from:
     * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
     */
    static rgb2hsl (r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);

        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;  // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return [h, s, l];
    }


    /**
     * Reloads RGB using HSL values
     * Converted from:
     * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
     */
    static hsl2rgb (h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l;  // achromatic
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = this._hue2rgb(p, q, h + 1 / 3);
            g = this._hue2rgb(p, q, h);
            b = this._hue2rgb(p, q, h - 1 / 3);
        }

        return [r * 255, g * 255, b * 255];
    }


    /**
     * Helper function to convert hue to rgb
     * Taken from:
     * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
     */
    static _hue2rgb (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
};
