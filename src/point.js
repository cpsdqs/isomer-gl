const vec3 = require('gl-vec3');
const Point = require('./point');

module.exports = class Point extends Float32Array {
    constructor (x, y, z) {
        super(3);

        if (Array.isArray(x)) {
            this.x = x[0];
            this.y = y[1];
            this.z = z[2];
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
    }

    set x(v) {
        this[0] = v;
    }

    get x() {
        return this[0];
    }

    set y(v) {
        this[1] = v;
    }

    get y() {
        return this[1];
    }

    set z(v) {
        this[2] = v;
    }

    get z() {
        return this[2];
    }

    mul (x, y, z) {
        if (y === undefined && z === undefined) {
            y = z = x;
        }

        const out = new Point();
        return vec3.multiply(out, this, [x, y, z]);
    }

    translate (dx, dy, dz) {
        const out = new Point();
        if (dx instanceof Point) {
            return vec3.add(out, this, dx);
        } else {
            return vec3.add(out, this, [dx, dy, dz]);
        }
    }

    scale (origin, dx, dy, dz) {
        if (dy === undefined && dz === undefined) {
            dy = dz = dx;
        }

        const p = this.translate(origin.mul(-1));
        p.mul(dx, dy, dz);
        return p.translate(origin);
    }

    rotateX (origin, angle) {
        const out = new Point();
        return vec3.rotateX(out, this, origin, angle);
    }

    rotateY (origin, angle) {
        const out = new Point();
        return vec3.rotateY(out, this, origin, angle);
    }

    rotateZ (origin, angle) {
        const out = new Point();
        return vec3.rotateZ(out, this, origin, angle);
    }

    static distance (p1, p2) {
        return vec3.distance(p1, p2);
    }
};
module.exports.ORIGIN = new module.exports(0, 0, 0);
