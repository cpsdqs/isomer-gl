const Shape = IsomerGL.Shape;
const Point = IsomerGL.Point;
const Color = IsomerGL.Color;
const Path = IsomerGL.Path;

const iso = new IsomerGL(document.querySelector('#art'));

const startTime = Date.now();
const draw = function () {
    let time = (Date.now() - startTime) / 1000;

    // random snippets pasted from https://jdan.github.io/isomer
    iso.add([
        Shape.Prism(Point.ORIGIN, 4, 4, 2),
        Shape.Prism(new Point(-1, 1, 0), 1, 2, 1),
        Shape.Prism(new Point(1, -1, 0), 2, 1, 1)
    ]);

    const red = new Color(160, 60, 50);
    const blue = new Color(50, 60, 160);

    iso.add(Shape.Pyramid(new Point(0, 2, 2)), red);
    iso.add(Shape.Prism(new Point(2, 0, 2)), blue);
    iso.add(Shape.extrude(new Path([
        new Point(1, 1, 2),
        new Point(2, 1, 2),
        new Point(2, 3, 2),
    ]), 0.3).rotateZ(Point.ORIGIN, Math.PI / 8), new Color(50, 160, 60));

    iso.add(Shape.Cylinder(new Point(3, 3, 2), 1, 6, 3)
        .rotateZ(new Point(3, 3, 2), time), new Color(130, 80, 10));

    iso.add(Shape.Prism(new Point(1, 3.5, 3), 4, 1, 1).rotateZ(new Point(3, 4, 3), time));

    iso.draw();

    requestAnimationFrame(draw);
};

draw();

