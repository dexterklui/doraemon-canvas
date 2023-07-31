const CANVAS_BASE_WIDTH = 750;
const CANVAS_BASE_HEIGHT = 620;
// whisker to head ratio (1.2) times head to face ratio (1.18)
const CONTAINER_WIDTH_RATIO = 1.416;
const CONTAINER_HEIGHT_RATIO = 1.18; // Also the head to face ratio
/** @type {number} scale - canvas scale */
let scale = 1;
/** @type {HTMLElement} doraHeadContainer */
const doraHeadContainer = document.querySelector("#dora-head-container");
/** @type {HTMLCanvasElement} canvas */
const canvasReal = document.querySelector("#canvas-real");
/** @type {HTMLCanvasElement} canvas */
const canvasDraft = document.querySelector("#canvas-draft");
/** @type {HTMLElement} doraHead */
const doraHead = document.querySelector("#doraemon-head");

/**
 * Creates svg path string for the outline of doraemon head/face
 * @param {number} w - width
 * @returns {string} svg path string
 */
function doraHeadSvgPath(w) {
  const h = 0.8 * w; // head/face height to width ratio
  return ` \
    M ${0.136 * w} ${h} \
    L ${0.864 * w} ${h} \
    C ${1.17333 * w} ${0.63225 * h} \
      ${0.91333 * w} 0 \
      ${0.5 * w} 0 \
    S ${-0.17333 * w} ${0.63225 * h} ${0.136 * w} ${h} \
  `;
}

/**
 * Resizes the whole doraemon head including the canvas
 */
function resizeDoraHead() {
  let canvasWidth = CANVAS_BASE_WIDTH * scale;
  let canvasHeight = CANVAS_BASE_HEIGHT * scale;
  doraHeadContainer.style.width = `${canvasWidth * CONTAINER_WIDTH_RATIO}px`;
  doraHeadContainer.style.height = `${canvasHeight * CONTAINER_HEIGHT_RATIO}px`;
  [canvasReal, canvasDraft].forEach((canvas) => {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.clipPath = `path("${doraHeadSvgPath(canvasWidth)}")`;
  });
  doraHead.style.clipPath = `path("${doraHeadSvgPath(
    canvasWidth * CONTAINER_HEIGHT_RATIO // Use full height of container
  )}")`;
}
