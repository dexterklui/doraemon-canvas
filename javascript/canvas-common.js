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
/** @type {PaintFunction} currentFunction */
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

/**
 * Superclass for individual canvas-painting functionalities.
 * @class PaintFunction
 */
class PaintFunction {
  /**
   * @param {CanvasRenderingContext2D} contextReal
   * @param {CanvasRenderingContext2D} contextDraft
   */
  constructor(contextReal, contextDraft) {
    this.contextReal = contextReal;
    this.contextDraft = contextDraft;
    this.clearDraft();
  }

  /**
   * Does cleaning up before the current functionality is dropped.
   */
  destructor() {}

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

  /**
   * Clears all drawing on draft canvas.
   */
  clearDraft() {
    this.contextDraft.clearRect(0, 0, canvasDraft.width, canvasDraft.height);
  }
}

/**
 * Sets strokes style for both real and draft canvas
 * @param {string} color
 */
function setStrokeStyle(color) {
  contextReal.strokeStyle = color;
  contextDraft.strokeStyle = color;
  /** @type {HTMLElement} strokeColor */
  const strokeColor = document.querySelector("#stroke-color");
  strokeColor.style.backgroundColor = color;
}

/**
 * Sets fill style for both real and draft canvas
 * @param {string} color
 */
function setFillStyle(color) {
  contextReal.fillStyle = color;
  contextDraft.fillStyle = color;
  /** @type {HTMLElement} fillColor */
  const fillColor = document.querySelector("#fill-color");
  fillColor.style.backgroundColor = color;
}

/**
 * Sets font style for both real and draft canvas
 * @param {number} [size=22]
 * @param {string} [family="arial"] - font family
 */
function setFontStyle(size = 22, family = "arial") {
  const style = `${size.toString()}px ${family}`;
  contextReal.font = style;
  contextDraft.font = style;
}
