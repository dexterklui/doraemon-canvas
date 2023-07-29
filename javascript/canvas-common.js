/**********************************************
 * The Canvas
 * ==================================
 ***********************************************/

/** @type {HTMLCanvasElement} canvas */
const canvasReal = document.querySelector("#canvas-real");
let contextReal = canvasReal.getContext("2d");
/** @type {HTMLCanvasElement} canvas */
const canvasDraft = document.querySelector("#canvas-draft");
let contextDraft = canvasDraft.getContext("2d");
let currentFunction;
let dragging = false;

canvasDraft.addEventListener("mousedown", (e) => {
  let mouseX = e.offsetX;
  let mouseY = e.offsetY;
  currentFunction?.onMouseDown([mouseX, mouseY], e);
  dragging = true;
});

canvasDraft.addEventListener("mousemove", (e) => {
  let mouseX = e.offsetX;
  let mouseY = e.offsetY;
  if (dragging) {
    currentFunction?.onDragging([mouseX, mouseY], e);
  }
  currentFunction?.onMouseMove([mouseX, mouseY], e);
});

canvasDraft.addEventListener("mouseup", (e) => {
  dragging = false;
  let mouseX = e.offsetX;
  let mouseY = e.offsetY;
  currentFunction?.onMouseUp([mouseX, mouseY], e);
});

canvasDraft.addEventListener("mouseleave", (e) => {
  dragging = false;
  let mouseX = e.offsetX;
  let mouseY = e.offsetY;
  currentFunction?.onMouseLeave([mouseX, mouseY], e);
});

canvasDraft.addEventListener("mouseenter", (e) => {
  let mouseX = e.offsetX;
  let mouseY = e.offsetY;
  currentFunction?.onMouseEnter([mouseX, mouseY], e);
});

/** # Class (all classes will have these methods) #
/*  ====================== */
class PaintFunction {
  constructor() {}
  onMouseDown() {}
  onDragging() {}
  onMouseMove() {}
  onMouseUp() {}
  onMouseLeave() {}
  onMouseEnter() {}
}
