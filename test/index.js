const Shape = Isomer.Shape;
const Point = Isomer.Point;
const Color = Isomer.Color;
const Path = Isomer.Path;

const iso = new Isomer(document.querySelector('#c'));
const isoGL = new IsomerGL(document.querySelector('#cgl'));

const startTime = Date.now();
const drawFrame = function (iso, isGL) {
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

    let text;
    if (isGL) {
        text = [
            '-xx--x---',
            'x----x---',
            'x--x-x---',
            '-xxx-xxxx',
        ];
    } else {
        text = [
            '-----x------xx----x',
            '-xx-xxx-x-x---x--xx',
            'x----x---x--x---x-x',
            '-xx--x--x-x-xxx-xxx',
        ];
    }

    let y = 0;
    let textColor = new Color(255, 127, 0);
    for (let line of text.reverse()) {
        let x = 0;
        for (let c of line) {
            if (c != '-') {
                iso.add(Shape.Prism(new Point(-1.25, 3 - 0.2 * x, 0.2 * y), 0.2, 0.2, 0.2), textColor);
            }
            x++;
        }
        y++;
    }
};

const draw = function () {
    requestAnimationFrame(draw);
    iso.canvas.ctx.clearRect(0, 0, iso.canvas.width, iso.canvas.height);
    drawFrame(iso);
    drawFrame(isoGL, true);
    isoGL.draw();
};

draw();

document.querySelector('#cmp-btn').addEventListener('click', e => {
    if (document.body.classList.contains('cmp')) {
        document.body.classList.remove('cmp');
    } else {
        document.body.classList.add('cmp');
    }
});
