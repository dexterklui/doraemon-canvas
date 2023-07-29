/**********************************************
 * The Canvas
 * ==================================
 ***********************************************/

/** @type {HTMLCanvasElement} canvas */
const canvasReal = document.querySelector("#canvas-real");
const contextReal = canvasReal.getContext("2d");
/** @type {HTMLCanvasElement} canvas */
const canvasDraft = document.querySelector("#canvas-draft");
const contextDraft = canvasDraft.getContext("2d");
let currentFunction;
let dragging = false;

canvasDraft.addEventListener("mousedown", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  currentFunction?.onMouseDown([mouseX, mouseY], e);
  dragging = true;
});

canvasDraft.addEventListener("mousemove", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  if (dragging) {
    currentFunction?.onDragging([mouseX, mouseY], e);
  }
  currentFunction?.onMouseMove([mouseX, mouseY], e);
});

canvasDraft.addEventListener("mouseup", (e) => {
  dragging = false;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  currentFunction?.onMouseUp([mouseX, mouseY], e);
});

canvasDraft.addEventListener("mouseleave", (e) => {
  dragging = false;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  currentFunction?.onMouseLeave([mouseX, mouseY], e);
});

canvasDraft.addEventListener("mouseenter", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  currentFunction?.onMouseEnter([mouseX, mouseY], e);
});

/** # Class (all classes will have these methods) #
/*  ====================== */
class PaintFunction {
  constructor() {}

  /**
   * @param {Number[]} coord
   * @param {MouseEvent} event
   */
  onMouseDown(coord, event) {}

  /**
   * @param {Number[]} coord
   * @param {MouseEvent} event
   */
  onDragging(coord, event) {}

  /**
   * @param {Number[]} coord
   * @param {MouseEvent} event
   */
  onMouseMove(coord, event) {}

  /**
   * @param {Number[]} coord
   * @param {MouseEvent} event
   */
  onMouseUp(coord, event) {}

  /**
   * @param {Number[]} coord
   * @param {MouseEvent} event
   */
  onMouseLeave(coord, event) {}

  /**
   * @param {Number[]} coord
   * @param {MouseEvent} event
   */
  onMouseEnter(coord, event) {}
}
