import DoraemonCanvas from "./modules/DoraemonCanvas.js";
import {
  DrawingLine,
  DrawingRectangle,
  DrawingBezierCurve,
  DrawingRegularPolygon,
  DrawingIrregularPolygon,
  DrawingText,
  SelectMove,
} from "./external-dependencies.js";
import "../coloris/coloris.min.js";

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

function polygonNumSidesHandler(e) {
  /** @type {HTMLInputElement} target */ // @ts-ignore
  const target = e.target;
  const value = parseInt(target.value);
  if (isNaN(value) || value < 3 || value > 99) return;
  const currentPaintFunction = doraemon.getPaintFunction();
  if (!(currentPaintFunction instanceof DrawingRegularPolygon)) return;
  currentPaintFunction.numSides = value;
}

/** Use values in color selectors to update stroke and fill color */
function updateColor() {
  // @ts-ignore
  const strokeColor = document.querySelector(".color-selector-stroke").value;
  // @ts-ignore
  const fillColor = document.querySelector(".color-selector-fill").value;
  doraemon.setStrokeStyle(strokeColor);
  doraemon.setFillStyle(fillColor);
}

/******************************************************/
/*                    Add doraemon                    */
/******************************************************/

const canvasApp = document.querySelector("#canvas-app");
/** @type {DoraemonCanvas} doraemon */
const doraemon = new DoraemonCanvas(canvasApp, true);
doraemon.div.id = "canvas-app";

/******************************/
/*        canvas tools        */
/******************************/
const buttons = document.querySelector(".buttons");
buttons.addEventListener("click", (e) => {
  /** @type {HTMLElement} target */ // @ts-ignore
  const target = e.target;
  const drawingTextBtn = buttons.querySelector("#drawing-text");
  /** @type {HTMLInputElement} polygonNumSidesInput */
  const polygonNumSidesInput = buttons.querySelector(".polygon-num-sides");
  if (!target.classList.contains("btn")) return;
  if (target.id === "drawing-text") {
    drawingTextBtn.textContent = "Font style";
  } else {
    drawingTextBtn.textContent = "Input Text";
  }
  if (
    target.id === "drawing-regular-polygon" ||
    target.classList.contains("polygon-num-sides")
  ) {
    polygonNumSidesInput.classList.remove("hidden");
    polygonNumSidesInput.focus();
  } else {
    polygonNumSidesInput.classList.add("hidden");
  }
});
buttons.querySelector("#drawing-rectangle").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingRectangle);
});
buttons.querySelector("#drawing-line").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingLine);
});
buttons.querySelector("#drawing-bezier-curve").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingBezierCurve);
});
buttons
  .querySelector("#drawing-regular-polygon")
  .addEventListener("click", () => {
    doraemon.setPaintFunction(DrawingRegularPolygon);
  });
buttons
  .querySelector(".polygon-num-sides")
  .addEventListener("blur", polygonNumSidesHandler);
buttons
  .querySelector(".polygon-num-sides")
  .addEventListener("change", polygonNumSidesHandler);
buttons
  .querySelector("#drawing-irregular-polygon")
  .addEventListener("click", () => {
    doraemon.setPaintFunction(DrawingIrregularPolygon);
  });
buttons.querySelector("#drawing-text").addEventListener("click", (e) => {
  const currentPaintFunction = doraemon.getPaintFunction();
  if (currentPaintFunction instanceof DrawingText) {
    if (buttons.querySelector("#font-style-panel")) return;
    const div = createFontStyleControl();
    div.style.position = "absolute";
    div.style.top = "3em";
    // @ts-ignore
    e.target.after(div);
  }
  doraemon.setPaintFunction(DrawingText);
});
buttons.querySelector("#select-move").addEventListener("click", () => {
  doraemon.setPaintFunction(SelectMove);
});

buttons.querySelector("#zoom-canvas").addEventListener("click", () => {
  doraemon.toggleZoom();
});
document.querySelector(".dora-pocket").addEventListener("click", () => {
  window.open(doraemon.dataUrl, "_blank");
});

/*********************************/
/*        Keypress events        */
/*********************************/

let ctlKeydownFlag = false;

document
  .querySelector(".dora-foot:first-child")
  .addEventListener("click", () => {
    doraemon.undo();
  });
document
  .querySelector(".dora-foot:last-child")
  .addEventListener("click", () => {
    doraemon.redo();
  });
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "Control":
      ctlKeydownFlag = true;
      break;
    case " ":
      if (!ctlKeydownFlag) doraemon.toggleZoom();
      break;
    case "z":
      if (ctlKeydownFlag) doraemon.undo();
      break;
    case "y":
      if (ctlKeydownFlag) doraemon.redo();
      break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "Control":
      ctlKeydownFlag = false;
      break;
  }
});

/*******************************/
/*        color-picker        */
/*******************************/

document.querySelectorAll(".color-selector").forEach((elem) => {
  elem.addEventListener("blur", () => {
    updateColor();
  });
});

/*********************************/
/*        initial setting        */
/*********************************/

doraemon.setFontStyle(20);
updateColor();
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
