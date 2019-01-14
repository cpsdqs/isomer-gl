const Path = require('./path');
const Point = require('./point');

module.exports = class Shape {
    constructor (...args) {
        if (Array.isArray(args[0])) {
            this.paths = args[0];
        } else {
            this.paths = args;
        }
    }

    push (path) {
        this.paths.push(path);
    }

    translate (...args) {
        return new Shape(this.paths.map(path => path.translate(...args)));
    }

    rotateX (...args) {
        return new Shape(this.paths.map(path => path.rotateX(...args)));
    }

    rotateY (...args) {
        return new Shape(this.paths.map(path => path.rotateY(...args)));
    }

    rotateZ (...args) {
        return new Shape(this.paths.map(path => path.rotateZ(...args)));
    }

    scale (...args) {
        return new Shape(this.paths.map(path => path.scale(...args)));
    }

    static extrude (path, height) {
        const topPath = path.translate(0, 0, height);
        const shape = new Shape();
        shape.push(path.reverse());
        shape.push(topPath);

        for (let i = 0; i < path.points.length; i++) {
            shape.push(new Path([
                topPath.points[i],
                path.points[i],
                path.points[(i + 1) % path.points.length],
                topPath.points[(i + 1) % topPath.points.length],
            ]));
        }

        return shape;
    }

    static Prism (origin, dx, dy, dz) {
        dx = (typeof dx === 'number') ? dx : 1;
        dy = (typeof dy === 'number') ? dy : 1;
        dz = (typeof dz === 'number') ? dz : 1;

        const prism = new Shape();

        // square parallel to the x-axis
        const face1 = new Path([
            origin,
            new Point(origin.x + dx, origin.y, origin.z),
            new Point(origin.x + dx, origin.y, origin.z + dz),
            new Point(origin.x, origin.y, origin.z + dz)
        ]);

        // Push this face and its opposite
        prism.push(face1);
        prism.push(face1.reverse().translate(0, dy, 0));

        // Square parallel to the y-axis
        const face2 = new Path([
            origin,
            new Point(origin.x, origin.y, origin.z + dz),
            new Point(origin.x, origin.y + dy, origin.z + dz),
            new Point(origin.x, origin.y + dy, origin.z)
        ]);

        prism.push(face2);
        prism.push(face2.reverse().translate(dx, 0, 0));

        // Square parallel to the xy-plane
        const face3 = new Path([
            origin,
            new Point(origin.x + dx, origin.y, origin.z),
            new Point(origin.x + dx, origin.y + dy, origin.z),
            new Point(origin.x, origin.y + dy, origin.z)
        ]);

        // This surface is oriented backwards, so we need to reverse the points
        prism.push(face3.reverse());
        prism.push(face3.translate(0, 0, dz));

        return prism;
    }

    static Pyramid (origin, dx, dy, dz) {
        dx = typeof dx === 'number' ? dx : 1;
        dy = typeof dy === 'number' ? dy : 1;
        dz = typeof dz === 'number' ? dz : 1;

        const pyramid = new Shape();

        // Path parallel to the x-axis
        const face1 = new Path([
            origin,
            new Point(origin.x + dx, origin.y, origin.z),
            new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz)
        ]);

        // Push the face, and its opposite face, by rotating around the Z-axis
        pyramid.push(face1);
        pyramid.push(face1.rotateZ(origin.translate(dx / 2, dy / 2), Math.PI));

        // Path parallel to the y-axis
        const face2 = new Path([
            origin,
            new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
            new Point(origin.x, origin.y + dy, origin.z)
        ]);

        pyramid.push(face2);
        pyramid.push(face2.rotateZ(origin.translate(dx / 2, dy / 2), Math.PI));

        return pyramid;
    }

    static Cylinder (origin, radius, vertices, height) {
        radius = typeof radius === 'number' ? radius : 1;

        const circle = Path.Circle(origin, radius, vertices);
        const cylinder = Shape.extrude(circle, height);

        return cylinder;
    }
};
