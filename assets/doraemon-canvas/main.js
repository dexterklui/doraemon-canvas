import DoraemonCanvas from "./modules/DoraemonCanvas.js";
import { DrawingLine, DrawingRectangle } from "./external-dependencies.js";

/***************************************/
/*        Variables declaration        */
/***************************************/

/** @type {DoraemonCanvas} doraemon */
const doraemon = new DoraemonCanvas();
doraemon.div.id = "canvas-app";
document.querySelector("#canvas-app").replaceWith(doraemon.div);

/******************************/
/*        canvas tools        */
/******************************/

document.querySelector("#drawing-rectangle").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingRectangle);
});
document.querySelector("#drawing-line").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingLine);
});
document.querySelector("#zoom-canvas").addEventListener("click", () => {
  doraemon.toggleZoom();
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
  doraemon.setStrokeStyle(color);
  doraemon.setFillStyle(color);
  colorIndicators.forEach((elem) => (elem.style.backgroundColor = color));
});

/*********************************/
/*        initial setting        */
/*********************************/

doraemon.setPaintFunction(DrawingLine);

/****************************/
/*        Import CSS        */
/****************************/

const scriptTag = document.querySelector(
  "script[src$='doraemon-canvas/main.js']"
);
const dirPath = scriptTag.getAttribute("src").replace(/main.js$/, "");
const headTag = document.querySelector("head");
const linkTag = document.createElement("link");
linkTag.href = dirPath + "style.css";
linkTag.type = "text/css";
linkTag.rel = "stylesheet";
headTag.append(linkTag);
