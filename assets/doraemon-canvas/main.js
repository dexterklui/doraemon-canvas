import DoraemonCanvas from "./modules/DoraemonCanvas.js";
import {
  DrawingLine,
  DrawingRectangle,
  DrawingBezierCurve,
  DrawingPolygon,
  DrawingText,
  SelectMove,
} from "./external-dependencies.js";

/*************************************/
/*        Function definition        */
/*************************************/

/**
 * Creates a control board for changing font style
 */
function createFontStyleControl() {
  const div = document.createElement("div");
  div.id = "font-style-panel";
  for (let size = 10; size <= 50; size += 2) {
    const btn = document.createElement("span");
    btn.classList.add("btn", "btn-info", "fa", "fa-paint-brush", "font-size");
    btn.textContent = size.toString();
    div.append(btn);
  }
  div.addEventListener("click", (e) => {
    // @ts-ignore
    doraemon.setFontStyle(e.target.textContent);
  });
  const body = document.querySelector("body");
  // XXX: Dunno if setTimeout(,0) is a good practice to prevent the fontStylePanel
  // from removing itself immediately
  setTimeout(() => {
    body.addEventListener("click", function f() {
      const fontStylePanel = document.querySelector("#font-style-panel");
      if (fontStylePanel) {
        fontStylePanel.remove();
        body.removeEventListener("click", f);
      }
    });
  }, 0);
  return div;
}

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
document.querySelector(".buttons").addEventListener("click", (e) => {
  /** @type {HTMLElement} target */
  // @ts-ignore
  const target = e.target;
  const drawingTextBtn = document.querySelector("#drawing-text");
  if (!target.classList.contains("btn")) return;
  if (target.id === "drawing-text") {
    drawingTextBtn.textContent = "Font style";
  } else {
    drawingTextBtn.textContent = "Input Text";
  }
});
document.querySelector("#drawing-rectangle").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingRectangle);
});
document.querySelector("#drawing-line").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingLine);
});
document
  .querySelector("#drawing-bezier-curve")
  .addEventListener("click", () => {
    doraemon.setPaintFunction(DrawingBezierCurve);
  });
document.querySelector("#drawing-polygon").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingPolygon);
});
document.querySelector("#drawing-text").addEventListener("click", (e) => {
  const currentPaintFunction = doraemon.getPaintFunction();
  if (currentPaintFunction instanceof DrawingText) {
    if (document.querySelector("#font-style-panel")) return;
    const div = createFontStyleControl();
    div.style.position = "absolute";
    div.style.top = "3em";
    // @ts-ignore
    e.target.after(div);
  }
  doraemon.setPaintFunction(DrawingText);
});
document.querySelector("#select-move").addEventListener("click", () => {
  doraemon.setPaintFunction(SelectMove);
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

doraemon.setFontStyle(20);
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
