const mat4 = require('gl-mat4');
const vec3 = require('gl-vec3');
const libtess = require('libtess');
const createShader = require('gl-shader');
const { Color, Shape, Path, Vector } = global.Isomer;

const point2vec = point => {
    const vec = new Float32Array(3);
    vec[0] = point.x;
    vec[1] = point.y;
    vec[2] = point.z;
    return vec;
};

const vector2vec = point => {
    const vec = new Float32Array(3);
    vec[0] = point.i;
    vec[1] = point.j;
    vec[2] = point.k;
    return vec;
};

const normalizeColor = color => {
    return [color.r / 255, color.g / 255, color.b / 255, color.a];
};

module.exports = global.IsomerGL = class IsomerGL {
    constructor (canvas, options = {}) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl');
        if (!this.gl) {
            throw new Error('Failed to create WebGL context');
        }
        this.angle = Math.PI / 5;
        this.scale = options.scale || 70;
        this.shapes = [];

        this.originX = options.originX || this.canvas.width / 2;
        this.originY = options.originY || this.canvas.height * 0.9;
        this.clipNear = -100;
        this.clipFar = 100;

        this.lightPosition = options.lightPosition || new Vector(2, -1, 3);
        this.lightAngle = this.lightPosition.normalize();

        this.colorDifference = 0.2;
        this.lightColor = options.lightColor || new Color(255, 255, 255);

        const pathShader = createShader(this.gl, `
precision mediump float;

attribute vec3 position;
uniform mat4 transform;

void main() {
    gl_Position = transform * vec4(position, 1);
}
        `, `
precision highp float;

uniform vec4 color;

void main() {
    gl_FragColor = color;
}
        `);
        pathShader.attributes.position.location = 0;

        this.shaders = {
            path: pathShader,
        };
    }

    add (shape, baseColor) {
        baseColor = baseColor || new Color(120, 120, 120);

        if (Array.isArray(shape)) {
            for (const s of shape) this.add(s, baseColor);
        } else if (shape instanceof Shape) {
            this.shapes.push({ shape, baseColor });
        } else if (shape instanceof Path) {
            this.shapes.push({
                shape: new Shape(shape),
                baseColor
            });
        } else {
            throw new TypeError('Cannot add non-shape object to IsomerGL');
        }
    }

    draw () {
        const { gl } = this;
        gl.clearColor(0, 0, 0, 0);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const transform = mat4.create();
        // no idea why, but Isomer has a 9/11 scaling factor
        const width = this.canvas.width / this.scale * 9 / 11;
        const height = this.canvas.height / this.scale * 9 / 11;
        // orthographic projection matrix
        mat4.ortho(transform, width / 2, -width / 2, -height / 2, height / 2, this.clipNear, this.clipFar);

        // apply origin offset
        const origin = mat4.create();
        mat4.translate(origin, origin, [
            this.originX / this.canvas.width * 2 - 1,
            this.originY / this.canvas.height * -2 + 1, 0, 0]);

        mat4.multiply(transform, origin, transform);

        const camera = mat4.create();
        // camera position
        mat4.rotate(camera, camera, this.angle, [1, 0, 0]);
        mat4.rotate(camera, camera, 3 * Math.PI / 4, [0, 1, 0]);

        mat4.multiply(transform, transform, camera);
        mat4.multiply(transform, transform, [
            // swap y and z
            1, 0, 0, 0,
            0, 0, 1, 0,
            0, 1, 0, 0,
            0, 0, 0, 1,
        ]);

        for (const { shape, baseColor } of this.shapes) {
            for (const path of shape.paths) {
                this.drawPath(path, transform, baseColor);
            }
        }

        this.shapes = [];
    }

    drawPath (path, transform, baseColor) {
        // tessellate
        const tess = new libtess.GluTesselator();
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, (data, arr) => {
            arr.push(data[0]);
            arr.push(data[1]);
            arr.push(data[2]);
        });

        let points = [];
        tess.gluTessBeginPolygon(points);
        tess.gluTessBeginContour();
        for (const point of path.points) {
            const p = point2vec(point);
            tess.gluTessVertex(p, p);
        }
        tess.gluTessEndContour();
        tess.gluTessEndPolygon();

        points = new Float32Array(points);

        const { gl } = this;

        const shader = this.shaders.path;
        shader.bind();
        shader.uniforms.transform = transform;

        // calculate color
        const v1 = vec3.create();
        const v2 = vec3.create();
        vec3.sub(v1, point2vec(path.points[0]), point2vec(path.points[1]));
        vec3.sub(v2, point2vec(path.points[1]), point2vec(path.points[2]));
        const normal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), v1, v2));
        const brightness = vec3.dot(normal, vector2vec(this.lightAngle));
        const color = baseColor.lighten(brightness * this.colorDifference, this.lightColor);

        shader.uniforms.color = normalizeColor(color);

        const verts = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, verts);
        gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);
    }
};
