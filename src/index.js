const Color = require('./color');
const Path = require('./path');
const Point = require('./point');
const Shape = require('./shape');
const IsomerGL = require('./isomer');

IsomerGL.Color = Color;
IsomerGL.Path = Path;
IsomerGL.Point = Point;
IsomerGL.Shape = Shape;
window.IsomerGL = module.exports = IsomerGL;
