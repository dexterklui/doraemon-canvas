import DoraemonCanvas from "./modules/DoraemonCanvas.js";
import {
  AddImage,
  DrawingLine,
  DrawingStraightLine,
  DrawingRectangle,
  DrawingQuadraticCurve,
  DrawingBezierCurve,
  DrawingCircle,
  DrawingEllipse,
  DrawingRegularPolygon,
  DrawingIrregularPolygon,
  DrawingText,
  Eraser,
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

function lineWidthHandler(e) {
  /** @type {HTMLInputElement} target */ // @ts-ignore
  const target = e.target;
  const value = parseInt(target.value);
  if (isNaN(value) || value < 1 || value > 99) return;
  doraemon.setCanvasProperties({ lineWidth: value });
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
const doraemon = new DoraemonCanvas(canvasApp, { replace: true });
doraemon.div.id = "canvas-app";

/******************************/
/*        canvas tools        */
/******************************/
const tools = document.querySelector(".tools");

tools.addEventListener("click", (e) => {
  /** @type {HTMLElement} target */ // @ts-ignore
  const target = e.target;
  const parent = target.parentElement;
  /** @type {HTMLInputElement} polygonNumSidesInput */
  const polygonNumSidesInput = tools.querySelector(".polygon-num-sides");
  const polygonNumSidesSetting = polygonNumSidesInput.parentElement;
  if (target === tools) return;
  if (
    target.closest(".tool-btn")?.id === "drawing-regular-polygon" ||
    target.classList.contains("polygon-num-sides")
  ) {
    polygonNumSidesSetting.classList.remove("hidden");
    polygonNumSidesInput.focus();
  } else {
    polygonNumSidesSetting.classList.add("hidden");
  }
  if (parent.classList.contains("tool-btn")) {
    tools
      .querySelector(".tool-btn--active")
      ?.classList.remove("tool-btn--active");
    parent.classList.add("tool-btn--active");
  }
});

tools.querySelector("#eraser").addEventListener("click", () => {
  doraemon.setPaintFunction(Eraser);
});
tools.querySelector("#drawing-rectangle").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingRectangle);
});
tools.querySelector("#drawing-line").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingLine);
});
tools.querySelector("#drawing-straight-line").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingStraightLine);
});
tools
  .querySelector("#drawing-quadratic-curve")
  .addEventListener("click", () => {
    doraemon.setPaintFunction(DrawingQuadraticCurve);
  });
tools.querySelector("#drawing-bezier-curve").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingBezierCurve);
});
tools.querySelector("#drawing-circle").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingCircle);
});
tools.querySelector("#drawing-ellipse").addEventListener("click", () => {
  doraemon.setPaintFunction(DrawingEllipse);
});
tools
  .querySelector("#drawing-regular-polygon")
  .addEventListener("click", () => {
    doraemon.setPaintFunction(DrawingRegularPolygon);
  });
tools
  .querySelector(".polygon-num-sides")
  .addEventListener("blur", polygonNumSidesHandler);
tools
  .querySelector(".polygon-num-sides")
  .addEventListener("change", polygonNumSidesHandler);
tools
  .querySelector("#drawing-irregular-polygon")
  .addEventListener("click", () => {
    doraemon.setPaintFunction(DrawingIrregularPolygon);
  });
tools.querySelector("#drawing-text").addEventListener("click", (e) => {
  const currentPaintFunction = doraemon.getPaintFunction();
  if (currentPaintFunction instanceof DrawingText) {
    if (tools.querySelector("#font-style-panel")) return;
    const div = createFontStyleControl();
    div.style.position = "absolute";
    div.style.top = "3em";
    // @ts-ignore
    e.target.after(div);
  }
  doraemon.setPaintFunction(DrawingText);
});
tools.querySelector("#select-move").addEventListener("click", () => {
  doraemon.setPaintFunction(SelectMove);
});

tools.querySelector("#zoom-canvas").addEventListener("click", () => {
  doraemon.toggleZoom();
});
document.querySelector("#add-image").addEventListener("click", () => {
  doraemon.setPaintFunction(AddImage);
});
document.querySelector("#clear-canvas").addEventListener("click", () => {
  doraemon.clearCanvas();
});
document.querySelector(".dora-pocket").addEventListener("click", () => {
  window.open(doraemon.dataUrl, "_blank");
});
const canvasLineWidthInput = document.querySelector(".canvas-line-width");
canvasLineWidthInput.addEventListener("blur", lineWidthHandler);
canvasLineWidthInput.addEventListener("change", lineWidthHandler);

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
