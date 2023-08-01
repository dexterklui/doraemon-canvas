// whisker to head width ratio = 1.2; head to face ratio = 1.18
const DORA_HEAD_BASE_WIDTH = 885;
const CANVAS_WIDTH = 1500;
const DORA_HEAD_HEIGHT_WIDTH_RATIO = 0.8;
/** @type {HTMLElement} doraHeadContainer */
const doraHead = document.querySelector("#dora-head");
/** @type {HTMLCanvasElement} canvas */
const canvasReal = doraHead.querySelector(".canvas-real");
/** @type {HTMLCanvasElement} canvas */
const canvasDraft = doraHead.querySelector(".canvas-draft");

for (let canvas of [canvasReal, canvasDraft]) {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_WIDTH * DORA_HEAD_HEIGHT_WIDTH_RATIO;
}

/**
 * Resizes the whole doraemon head including the canvas
 * @param {number} scale
 */
function resizeDoraHead(scale) {
  if (!scale) return;
  doraHead.style.width = `${DORA_HEAD_BASE_WIDTH * scale}px`;
  doraHead.style.height = `${
    DORA_HEAD_BASE_WIDTH * DORA_HEAD_HEIGHT_WIDTH_RATIO * scale
  }px`;
}
