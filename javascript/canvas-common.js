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
const contextReal = canvasReal.getContext("2d");
const contextDraft = canvasDraft.getContext("2d");
/** @type {PaintFunction} currentFunction */
let currentFunction;
let dragging = false;
let coordCoefficient = 1;
let zoomed = false;

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

/** # Class (all classes will have these methods) #
/*  ====================== */
class PaintFunction {
  /**
   * @param {CanvasRenderingContext2D} contextReal
   * @param {CanvasRenderingContext2D} contextDraft
   */
  constructor(contextReal, contextDraft) {
    this.contextReal = contextReal;
    this.contextDraft = contextDraft;
  }

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
 * Sets the scale of canvas
 * @param {number} newScale
 * @returns {number} the new scale applied or undefined if no new scaled applied
 */
function setScale(newScale) {
  if (!newScale) return;
  resizeDoraHead(newScale);
  updateCoordCoefficient();
  return newScale;
}

function updateCoordCoefficient() {
  const { width } = canvasReal.getBoundingClientRect();
  coordCoefficient = CANVAS_WIDTH / width;
}
