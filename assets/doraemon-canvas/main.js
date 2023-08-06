import DoraemonCanvas from "./modules/DoraemonCanvas.js";
import {
  DrawingLine,
  DrawingRectangle,
  DrawingBezierCurve,
  DrawingPolygon,
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

/** Use values in color selectors to update stroke and fill color */
function updateColor() {
  // @ts-ignore
  const strokeColor = document.querySelector(".color-selector-stroke").value;
  // @ts-ignore
  const fillColor = document.querySelector(".color-selector-fill").value;
  doraemon.setStrokeStyle(strokeColor);
  doraemon.setFillStyle(fillColor);
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
