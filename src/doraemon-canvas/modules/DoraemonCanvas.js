import {
  DrawingCanvas,
  PaintFunction,
  DrawingText,
} from "../external-dependencies.js";
import ToolPanel from "./ToolPanel.js";

const DORA_FACE_ASPECT_RATIO = 0.8;
const CANVAS_WIDTH_COEFFICIENT = 0.75;
const DORA_BLUE = "#15a9ff";

/** @type {Options} DEFAULT_OPTIONS */
const DEFAULT_OPTIONS = {
  replace: false,
  keyboardShortcuts: false,
};

/**
 * @returns {number} random integer inclusive between start and end
 */
function randomInt(start, end) {
  start = Math.floor(start);
  end = Math.floor(end);
  return start + Math.floor((end - start + 1) * Math.random());
}

function randomRgbColorStr() {
  const r = randomInt(0, 255);
  const g = randomInt(0, 255);
  const b = randomInt(0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * A Doraemon themed canvas that allows user to draw on it.
 */
export default class DoraemonCanvas {
  /**
   * Creates a Doraemon theme canvas
   * @param {Element} parent - parent element of this DoraemonCanvas
   * @param {Object} [options] - see {@link Options}
   */
  constructor(parent, options = {}) {
    options = { ...DEFAULT_OPTIONS, ...options };
    this.#doraDiv = this.#createDoraemon();
    this.#toolPanel = this.#createToolPanel();
    this.#drawingCanvas = this.#createDrawingCanvas();
    this.#tooltip = this.#createTooltip();

    if (options.replace) {
      this.#addHandlerToResize(parent.parentNode);
      parent.replaceWith(this.#doraDiv);
    } else {
      this.#addHandlerToResize(parent);
      parent.append(this.#doraDiv);
    }
    if (options.keyboardShortcuts) this.#addKeyboardShortcuts();

    this.#addDoraClickHandlers();
    this.#addHoverTooltipHandler();
    this.#addTooltipHandler();
    window.addEventListener("resize", () => this.resizeCanvas());
    this.#doraDiv.addEventListener("transitionend", () => this.resizeCanvas());

    // @ts-ignore
    this.mainToolPanelDiv.querySelector("#drawing-line").click();
  }

  /**
   * The options for DoraemonCanvas.
   * @typedef {Object} Options
   * @property {boolean} replace - whether this doraemon element replaces the
   *                     parent element rather than append to it
   * @property {boolean} keyboardShortcuts - whether keyboard shortcuts should
   *                     be added
   */

  /****************************************************************/
  /*                    Public getters/setters                    */
  /****************************************************************/

  /**
   * Gets the doraemon canvas element.
   * @type {HTMLDivElement}
   */
  get doraDiv() {
    return this.#doraDiv;
  }

  get mainToolPanelDiv() {
    return this.#toolPanel.mainPanelDiv;
  }

  get toolPanelTooltipSpan() {
    return this.#toolPanel.tooltipSpan;
  }

  get doraTooltipSpan() {
    return this.#tooltip;
  }

  /** @returns {string} an png image data URL for the real canvas */
  get dataUrl() {
    return this.#drawingCanvas.dataUrl;
  }

  static get DEFAULT_OPTIONS() {
    return DEFAULT_OPTIONS;
  }

  /********************************************************/
  /*                    Public methods                    */
  /********************************************************/

  /**
   * Toggles zoom in/out to the drawing canvas.
   * @returns {boolean} true if ending in zoom-in state; false for zoom-out
   */
  toggleZoom() {
    const doraDiv = this.#doraDiv;
    this.#zoomFlag = !this.#zoomFlag;
    if (this.#zoomFlag) {
      this.#origHeight = this.#doraDiv.style.height;
      doraDiv.style.height = this.#ZOOM_HEIGHT;
      this.#origTransform = this.#doraDiv.style.transform;
      doraDiv.style.transform = this.#ZOOM_TRANSFORM;
    } else {
      doraDiv.style.height = this.#origHeight ?? "100%";
      doraDiv.style.transform = this.#origTransform ?? "none";
    }
    return this.#zoomFlag;
  }

  /**
   * @returns {PaintFunction} current drawing functionality
   */
  getPaintFunction() {
    return this.#drawingCanvas.paintFunction;
  }

  /**
   * Sets a new {@link PaintFunction}.
   * @param {typeof PaintFunction} PaintFunction
   */
  setPaintFunction(PaintFunction) {
    this.#drawingCanvas.paintFunction?.destructor();
    const ctxReal = this.#drawingCanvas.ctxReal;
    const ctxDraft = this.#drawingCanvas.ctxDraft;
    const paintFunction = new PaintFunction(
      ctxReal,
      ctxDraft,
      this.#drawingCanvas.writeUndo.bind(this.#drawingCanvas)
    );
    this.#drawingCanvas.paintFunction = paintFunction;
  }

  /**
   * Sets new stroke style.
   * @param {string} color
   */
  setStrokeStyle(color) {
    this.setCanvasProperties({ strokeStyle: color });
  }

  /**
   * Sets new fill style.
   * @param {string} color
   */
  setFillStyle(color) {
    this.setCanvasProperties({ fillStyle: color });
  }

  /**
   * Sets font style.
   * @param {number} [size=22]
   * @param {string} [family="arial"] - font family
   */
  setFontStyle(size = 22, family = "arial") {
    this.setCanvasProperties({ font: `${size}px ${family}` });
  }

  /**
   * Sets certain property values for both real and draft canvas.
   * @param {Object} options - Storing key-value pairs of supported properties
   * @see {@link DrawingCanvas}
   */
  setCanvasProperties(options) {
    this.#drawingCanvas.setCanvasProperties(options);
    this.getPaintFunction()?.updateCursor();
  }

  /**
   * Gets centain property values for only real canvas.
   * @returns {Object.<string,any>}
   * @see {@link DrawingCanvas}
   */
  getCanvasProperties() {
    return this.#drawingCanvas.getCanvasProperties();
  }

  /** Undo previous draw operation */
  undo() {
    this.#drawingCanvas.undo();
  }

  /** Redo previous undone draw operation */
  redo() {
    this.#drawingCanvas.redo();
  }

  /** Clears all drawing on both real and draft canvas. */
  clearCanvas() {
    // This calls the destructor to clear cache waiting to be applied to canvas
    // @ts-ignore
    this.setPaintFunction(this.getPaintFunction().constructor);
    this.#drawingCanvas.clearAll();
    this.#drawingCanvas.writeUndo();
  }

  /**
   * Resizes canvas to fit parent's size. The purpose is to increase performance
   * and reduce lag by removing the need to adjust MouseEvent coordinate by a
   * scale factor.
   */
  resizeCanvas() {
    if (this.#zoomFlag) {
      this.#drawingCanvas.resizeCanvas();
      return;
    }
    const doraFace = this.#doraDiv.querySelector(".dora-face");
    const { width, height } = doraFace.getBoundingClientRect();
    const scale = parseInt(this.#ZOOM_HEIGHT.replace(/%$/, "")) / 100;
    this.#drawingCanvas.resizeCanvas(scale * width, scale * height);
  }

  randomDoraColor() {
    const color = randomRgbColorStr(); // @ts-ignore
    this.#doraDiv.querySelector(".dora-skull").style.backgroundColor = color;
  }

  resetDoraColor() {
    // @ts-ignore
    this.#doraDiv.querySelector(".dora-skull").style.backgroundColor =
      DORA_BLUE;
  }

  /********************************************************/
  /*                    Private fields                    */
  /********************************************************/

  /** @type {HTMLDivElement} #doraDiv */
  #doraDiv;

  /** @type {boolean} #zoomFlag */
  #zoomFlag;

  /** @type {string} #origHeight */
  #origHeight;

  /** @type {string} #origTransform */
  #origTransform;

  /** @type {DrawingCanvas} #drawingCanvas */
  #drawingCanvas;

  /** @type {ToolPanel} #toolPanel */
  #toolPanel;

  /** @type {HTMLSpanElement} #tooltip */
  #tooltip;

  /** @type {string} */
  get #ZOOM_HEIGHT() {
    // "170.71%" if want to be excatly the full height of canvas.
    return "200%";
  }

  /** @type {string} */
  get #ZOOM_TRANSFORM() {
    // -11.5% here with 170.71% zoom if want to show excatly the full canvas.
    return "translateY(-15%)";
  }

  /*********************************************************/
  /*                    Private methods                    */
  /*********************************************************/

  /** @returns {HTMLDivElement} */
  #createDoraemon() {
    const div = document.createElement("div");
    div.classList.add("doraemon-canvas");
    div.innerHTML = `
<div class="dora-head">
  <div class="dora-skull"></div>
  <div class="dora-face"></div>
  <div class="dora-eyes">
    <div class="dora-eye">
      <div class="dora-eye-white">
        <div class="dora-eye-black">
          +
        </div>
      </div>
    </div>
    <div class="dora-eye">
      <div class="dora-eye-white">
        <div class="dora-eye-black">
          -
        </div>
      </div>
    </div>
  </div>
</div>
<div class="dora-collar">
  <div class="dora-collar-strip"></div>
  <div class="dora-collar-bell dora-interactive-part"></div>
</div>
<div class="dora-body">
  <div class="dora-tummy">
    <div class="dora-pocket clip-outline dora-interactive-part">
      <div class="dora-pocket"></div>
    </div>
  </div>
  <div class="dora-feet">
    <div class="dora-foot dora-interactive-part">
      <div class="dora-foot-shadow">
        <div class="dora-foot-shadow-clip"></div>
      </div>
    </div>
    <div class="dora-foot dora-interactive-part">
      <div class="dora-foot-shadow">
        <div class="dora-foot-shadow-clip"></div>
      </div>
    </div>
  </div>
</div>
<span class="dora-tooltip dora-tooltip-download-image">
  Click me to download your drawings
</span>
<span class="dora-tooltip dora-tooltip-undo">
  Click me to undo
</span>
<span class="dora-tooltip dora-tooltip-redo">
  Click me to redo
</span>
`;
    return div;
  }

  #createToolPanel() {
    return new ToolPanel(this);
  }

  #createDrawingCanvas() {
    const longerDimension = Math.max(window.innerWidth, window.innerHeight);
    const width = longerDimension * CANVAS_WIDTH_COEFFICIENT;
    const height = width * DORA_FACE_ASPECT_RATIO;
    const doraFace = this.#doraDiv.querySelector(".dora-face");
    const toolMainPanel = this.mainToolPanelDiv;
    return new DrawingCanvas(doraFace, {
      canvasWidth: width,
      canvasHeight: height,
      lineWidth: toolMainPanel.querySelector(
        ".canvas-setting input[name='line-width']" // @ts-ignore
      ).value,
      strokeStyle: toolMainPanel.querySelector(
        ".color-selector input[name='stroke-style']" // @ts-ignore
      ).value,
      fillStyle: toolMainPanel.querySelector(
        ".color-selector input[name='fill-style']" // @ts-ignore
      ).value,
      font:
        toolMainPanel.querySelector(
          "#drawing-text-setting input[name='font-size']" // @ts-ignore
        ).value + "px arial",
    });
  }

  #createTooltip() {
    const tooltip = document.createElement("span");
    tooltip.classList.add("dora-hover-tooltip");
    return tooltip;
  }

  /**
   * Adds handler to resize canvas after doraemon is added to DOM.
   * @param {Node} parent
   */
  #addHandlerToResize(parent) {
    const observer = new MutationObserver(() => {
      for (const child of Array.from(parent.childNodes)) {
        if (child !== this.#doraDiv) continue;
        // XXX: Dunno why but even after Doraemon is added to DOM, it seems
        // canvas's parent (.dora-face, which is already a descendant node of
        // Doraemon) still doesn't have it's width and height updated. So wait
        // 300ms here, otherwise the canvas' size, thus doraemon's size, will
        // mess up.
        setTimeout(() => this.resizeCanvas(), 300);
        observer.disconnect();
        return;
      }
    });
    observer.observe(parent, { childList: true });
  }

  #addDoraClickHandlers() {
    this.#doraDiv
      .querySelector(".dora-pocket")
      .addEventListener("click", () => window.open(this.dataUrl, "_blank"));
    this.#doraDiv
      .querySelector(".dora-foot:first-child")
      .addEventListener("click", () => this.undo());
    this.#doraDiv
      .querySelector(".dora-foot:last-child")
      .addEventListener("click", () => this.redo());
    this.#doraDiv
      .querySelector(".dora-collar-bell")
      .addEventListener("click", () => this.randomDoraColor());
    this.#doraDiv
      .querySelector(".dora-collar-bell")
      .addEventListener("dblclick", () => this.resetDoraColor());
    this.#doraDiv
      .querySelector(".dora-eye:first-child")
      .addEventListener("click", () => {
        if (!this.#zoomFlag) this.toggleZoom();
      });
    this.#doraDiv
      .querySelector(".dora-eye:last-child")
      .addEventListener("click", () => {
        if (this.#zoomFlag) this.toggleZoom();
      });
  }

  #addHoverTooltipHandler() {
    /** @type {HTMLDivElement} body */
    const doraBody = this.#doraDiv.querySelector(".dora-body");
    /** @type {HTMLSpanElement} tooltip */
    const tooltip = this.#tooltip;
    const pocket = doraBody.querySelector(".dora-pocket");
    const leftFoot = doraBody.querySelector(".dora-foot:first-child");
    const rightFoot = doraBody.querySelector(".dora-foot:last-child");
    const activeClass = "dora-hover-tooltip--active";

    doraBody.addEventListener("mousemove", (e) => {
      const hoverDiv = doraBody.querySelector(".dora-interactive-part:hover");
      switch (hoverDiv) {
        case pocket:
          tooltip.textContent = "Download drawing";
          break;
        case leftFoot:
          tooltip.textContent = "Undo (Ctrl+Z)";
          break;
        case rightFoot:
          tooltip.textContent = "Redo (Ctrl+Y)";
          break;
        default:
          tooltip.classList.remove(activeClass);
          tooltip.textContent = "";
          return;
      }
      tooltip.style.left = e.clientX.toString() + "px";
      tooltip.style.top = e.clientY.toString() + "px";
      tooltip.classList.add(activeClass);
    });

    doraBody.addEventListener("mouseleave", () => {
      tooltip.textContent = "";
      tooltip.classList.remove(activeClass);
    });
  }

  #addTooltipHandler() {
    this.#doraDiv.querySelectorAll(".dora-tooltip").forEach((tooltip) => {
      tooltip.addEventListener("animationend", () => tooltip.remove());
    });
  }

  #addKeyboardShortcuts() {
    const tool = this.mainToolPanelDiv.querySelector.bind(
      this.mainToolPanelDiv
    );
    window.addEventListener("keydown", (e) => {
      const paintFunction = this.getPaintFunction();
      if (paintFunction instanceof DrawingText && paintFunction.draftInput)
        return;
      switch (e.key) {
        case "Control":
          this.ctrlKeydown = true;
          break;
        case " ":
          if (!this.ctrlKeydown) this.toggleZoom();
          break;
        case "a":
          if (!this.ctrlKeydown) tool("#add-image").click();
          break;
        case "b":
          if (!this.ctrlKeydown) tool("#drawing-bezier-curve").click();
          break;
        case "c":
          if (!this.ctrlKeydown) tool("#drawing-circle").click();
          if (this.ctrlKeydown) tool("#clear-canvas").click();
          break;
        case "e":
          if (!this.ctrlKeydown) tool("#eraser").click();
          break;
        case "f":
          if (!this.ctrlKeydown) tool("#drawing-line").click();
          break;
        case "i":
          if (!this.ctrlKeydown) tool("#drawing-irregular-polygon").click();
          break;
        case "l":
          if (!this.ctrlKeydown) tool("#drawing-ellipse").click();
          break;
        case "m":
          if (!this.ctrlKeydown) tool("#select-move").click();
          break;
        case "r":
          if (!this.ctrlKeydown) tool("#drawing-rectangle").click();
          break;
        case "t":
          if (!this.ctrlKeydown) tool("#drawing-text").click();
          break;
        case "p":
          if (!this.ctrlKeydown) tool("#drawing-regular-polygon").click();
          break;
        case "q":
          if (!this.ctrlKeydown) tool("#drawing-quadratic-curve").click();
          break;
        case "s":
          if (!this.ctrlKeydown) tool("#drawing-straight-line").click();
          break;
        case "u":
          if (!this.ctrlKeydown) tool("#drawing-bezier-curve").click();
          break;
        case "z":
          if (this.ctrlKeydown) this.undo();
          break;
        case "y":
          if (this.ctrlKeydown) this.redo();
          break;
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "Control":
          this.ctrlKeydown = false;
          break;
      }
    });
  }
}

export { DoraemonCanvas };
