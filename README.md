# Canvas Render demo

This project demonstrates how to utilize the HTML canvas element as a 2D rendering layer. It leverages React to bootstrap the application, the canvas element for drawing, and the gl-matrix library for vector operations.

## Getting started

```
git clone git@github.com:kocur4d/canvas-render-demo.git
cd canvas-render-demo
npm install
npm run start
```

### How does it work

The input data consists of rectangles described in the following format:

```
  {
    name: "Table 1",
    geometry: {
      x: 500,
      y: 500,
      h: 100,
      w: 100,
      a: 45,
    },
  },
```
In this geometry representation, `x` and `y` specify the top-left corner, `h` and `w` define the width and height, and `a` represents the anticlockwise rotation around the middle of the rectangle. These geometric properties are easily transformed into three matrix operations: translate, scale, and rotate.

The input data is converted into a scene graph, which serves as the application's source of truth.

The primary HTML component used is the canvas element, which connects to the rendering framework through event handlers:

```
    <canvas
      ref={ref}
      onMouseMove={handleOnMouseMove}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onWheel={handleOnWheel}
    />
```
Mouse movements are tracked and compared to the scene. When specific conditions are met (e.g., cursor over shape, cursor over edge, mouse clicked), and the user starts dragging, a matrix transformation routine from the Scene/Transformations folder is called to modify the affected node. This, in turn, triggers a redraw of the entire scene.

### Gotchas

This is a quick demo, and there is room for improvement. Be aware that many edge cases can cause the application to fail, often due to division by zero errors.

### Demo

https://github.com/kocur4d/canvas-render-demo/assets/1427354/5e5cdc0d-ea59-45da-b06b-1a3faf0ec857

