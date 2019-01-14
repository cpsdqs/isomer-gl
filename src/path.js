module.exports = class Path {
    constructor (...args) {
        if (Array.isArray(args[0])) {
            this.points = args[0];
        } else {
            this.points = args;
        }
    }

    push (point) {
        this.points.push(point);
    }

    reverse () {
        return new Path(this.points.slice().reverse());
    }

    translate (...args) {
        return new Path(this.points.map(point => point.translate(...args)));
    }

    rotateX (...args) {
        return new Path(this.points.map(point => point.rotateX(...args)));
    }

    rotateY (...args) {
        return new Path(this.points.map(point => point.rotateY(...args)));
    }

    rotateZ (...args) {
        return new Path(this.points.map(point => point.rotateZ(...args)));
    }

    scale (...args) {
        return new Path(this.points.map(point => point.scale(...args)));
    }

    static Rectangle (origin, width, height) {
        width = typeof width === 'number' ? width : 1;
        height = typeof height === 'number' ? height : 1;

        return new Path([
            origin,
            new Point(origin.x + width, origin.y, origin.z),
            new Point(origin.x + width, origin.y + height, origin.z),
            new Point(origin.x, origin.y + height, origin.z),
        ]);
    }

    static Circle (origin, radius, vertices) {
        vertices = vertices || 20;

        const path = new Path();
        for (let i = 0; i < vertices; i++) {
            path.push(new Point(
                radius * Math.cos(i * 2 * Math.PI / vertices),
                radius * Math.sin(i * 2 * Math.PI / vertices),
                0,
            ));
        }

        return path.translate(origin);
    }
};
