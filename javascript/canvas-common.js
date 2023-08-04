/**********************************************
 * The Canvas
 * ==================================
 ***********************************************/

/***************************************/
/*        Variables declaration        */
/***************************************/
// whisker to head width ratio = 1.2; head to face ratio = 1.18
const CANVAS_WIDTH = 1500;
const DORA_HEAD_HEIGHT_WIDTH_RATIO = 0.8;
/** @type {HTMLElement} doraHead */
const doraHead = document.querySelector("#dora-head");
/** @type {HTMLCanvasElement} canvasReal */
const canvasReal = doraHead.querySelector(".canvas-real");
/** @type {HTMLCanvasElement} canvasDraft */
const canvasDraft = doraHead.querySelector(".canvas-draft");
/** @type {HTMLElement} dora */
const dora = document.querySelector(".dora");
/** @type {CanvasRenderingContext2D} contextReal */
const contextReal = canvasReal.getContext("2d");
/** @type {CanvasRenderingContext2D} contextDraft */
const contextDraft = canvasDraft.getContext("2d");
/** @type {PaintFunction} currentFunction */
let currentFunction;
/** @type {boolean} dragging */
let dragging = false;
/**
 * @type {number} coordCoefficient
 * for correcting coordinates of mouse events under different size of canvas
 */
let coordCoefficient = 1;
/** @type {boolean} zoomed - tracks whether currently zoomed to dora's canvas*/
let zoomed = false;

/*************************************/
/*        Function definition        */
/*************************************/
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

function updateCoordCoefficient() {
  const { width } = canvasReal.getBoundingClientRect();
  coordCoefficient = CANVAS_WIDTH / width;
}

/************************************************/
/*        Class PaintFunction definition        */
/************************************************/
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

/************************************/
/*        Set up canvas size        */
/************************************/
for (let canvas of [canvasReal, canvasDraft]) {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_WIDTH * DORA_HEAD_HEIGHT_WIDTH_RATIO;
}

/***************************************/
/*        Canvas event handlers        */
/***************************************/
canvasDraft.addEventListener("mousedown", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  currentFunction?.onMouseDown(
    [mouseX * coordCoefficient, mouseY * coordCoefficient],
    e
  );
  dragging = true;
});

canvasDraft.addEventListener("mousemove", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  if (dragging) {
    currentFunction?.onDragging(
      [mouseX * coordCoefficient, mouseY * coordCoefficient],
      e
    );
  }
  currentFunction?.onMouseMove(
    [mouseX * coordCoefficient, mouseY * coordCoefficient],
    e
  );
});

canvasDraft.addEventListener("mouseup", (e) => {
  dragging = false;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  currentFunction?.onMouseUp(
    [mouseX * coordCoefficient, mouseY * coordCoefficient],
    e
  );
});

canvasDraft.addEventListener("mouseleave", (e) => {
  dragging = false;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  currentFunction?.onMouseLeave(
    [mouseX * coordCoefficient, mouseY * coordCoefficient],
    e
  );
});

canvasDraft.addEventListener("mouseenter", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  currentFunction?.onMouseEnter(
    [mouseX * coordCoefficient, mouseY * coordCoefficient],
    e
  );
});
