# isomer-gl
https://github.com/jdan/isomer WebGL Renderer

```javascript
const iso = new IsomerGL(document.querySelector('#canvas'));

iso.add(Isomer.Shape.Prism(new Isomer.Point()))
// ...

// renderer does not draw immediately
iso.draw();
```
