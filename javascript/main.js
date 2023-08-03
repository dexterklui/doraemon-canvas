import DrawingCanvas from "./modules/DrawingCanvas.js";
import { DrawingLine, DrawingRectangle } from "./modules/paint-functions.js";

/***************************************/
/*        Variables declaration        */
/***************************************/
const CANVAS_WIDTH = 1500;
const DORA_HEAD_HEIGHT_WIDTH_RATIO = 0.8; // Face has same ratio
/** @type {HTMLElement} doraHead */
const doraHead = document.querySelector("#dora-head");
/** @type {HTMLElement} dora */
const dora = document.querySelector(".dora");
/** @type {boolean} zoomed - tracks whether currently zoomed to dora's canvas*/
let zoomed = false;
/** @type {DrawingCanvas} drawingCanvas */
const drawingCanvas = new DrawingCanvas(
  dora.querySelector(".canvas-real"),
  dora.querySelector(".canvas-draft"),
  CANVAS_WIDTH,
  CANVAS_WIDTH * DORA_HEAD_HEIGHT_WIDTH_RATIO
);
const contextReal = drawingCanvas.ctxReal;
const contextDraft = drawingCanvas.ctxDraft;

/******************************/
/*        canvas tools        */
/******************************/
document.querySelector("#drawing-rectangle").addEventListener("click", () => {
  drawingCanvas.paintFunction = new DrawingRectangle(contextReal, contextDraft);
});
document.querySelector("#drawing-line").addEventListener("click", () => {
  drawingCanvas.paintFunction = new DrawingLine(contextReal, contextDraft);
});
document.querySelector("#zoom-canvas").addEventListener("click", () => {
  if (zoomed) {
    dora.style.height = "100%";
    dora.style.transform = "none";
  } else {
    // -- This zooms to show exactly the full canvas --
    // dora.style.height = "170.71%";
    // dora.style.transform = "translateY(-11.5%)";
    // -- This zooms even more --
    dora.style.height = "220%";
    dora.style.transform = "translateY(-15%)";
  }
  zoomed = !zoomed;
});

/*******************************/
/*        color-picker        */
/*******************************/
const colorPalette = document.querySelector(".color-palette");
const colors = [
  "black",
  "white",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
];
for (const color of colors) {
  const colorWell = document.createElement("div");
  colorWell.classList.add("color", `color-${color}`);
  colorWell.setAttribute("data-color", color);
  colorWell.style.backgroundColor = color;
  colorPalette.append(colorWell);
}
/** @type {HTMLDivElement[]} colorIndicators */
// @ts-ignore
const colorIndicators = document.querySelectorAll(".color-indicator");
colorPalette.addEventListener("click", (e) => {
  // @ts-ignore
  const color = e.target.getAttribute("data-color");
  drawingCanvas.setStrokeStyle(color);
  drawingCanvas.setFillStyle(color);
  colorIndicators.forEach((elem) => (elem.style.backgroundColor = color));
});

/*********************************/
/*        initial setting        */
/*********************************/
drawingCanvas.paintFunction = new DrawingLine(contextReal, contextDraft);
