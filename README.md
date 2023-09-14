# Canvas Render demo

This project shows how canvas could be used as a 2D rendering layer.

Project uses React to bootstrap the app, canvas as a drawing layer and gl-matrix lib for vector operations.

## How to start

```
git clone git@github.com:kocur4d/canvas-render-demo.git
cd canvas-render-demo
npm install
npm run start
```

### How does it work

Input data in are the rectangles

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
This geomety represents `x,y` as a top left corner `h,w` are width and height and `a` is anticlockwise rotation around the middle of the rect.
This geometry can by eaisly turn into three matrix operation, translate, scale and rotate.

Input date gets converted into the scene graph which is the application source of truth.

Main, and only, HTML component used is canvas. Which simply hooksup to rendering framework via event handlers.

```
    <canvas
      ref={ref}
      onMouseMove={handleOnMouseMove}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onWheel={handleOnWheel}
    />
```
Mouse movemnt gets tracked and compared to the scene. When conditions are meet, cursor over shape/cursor over edge/ mosue clicked, and user starts dragging. 
One matrix transformation routine from `Scene/Transformations` folder will be called modifing the affected node which in turn will force all of the scene to be redrawn.

### Gotchas

This is just a quick demo. Alot of things can be improved. Most of the edge cases will result in application blowing up mostly due to division by 0.

### Demo

https://github.com/kocur4d/canvas-render-demo/assets/1427354/5e5cdc0d-ea59-45da-b06b-1a3faf0ec857

