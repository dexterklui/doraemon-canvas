import { DrawingCanvas, PaintFunction } from "../external-dependencies.js";

const DORA_FACE_ASPECT_RATIO = 0.8;
const CANVAS_WIDTH_COEFFICIENT = 0.75;

/** @type {Options} DEFAULT_OPTIONS */
const DEFAULT_OPTIONS = {
  replace: false,
};

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
    this.#div = this.#createDoraemon();
    const longerDimension = Math.max(window.innerWidth, window.innerHeight);
    const width = longerDimension * CANVAS_WIDTH_COEFFICIENT;
    const height = width * DORA_FACE_ASPECT_RATIO;
    const doraFace = this.#div.querySelector(".dora-face");
    this.#drawingCanvas = new DrawingCanvas(doraFace, {
      canvasWidth: width,
      canvasHeight: height,
      // @ts-ignore
      lineWidth: document.querySelector(".canvas-line-width").value,
      strokeStyle: document.querySelector(".color-selector-stroke"),
      fillstyle: document.querySelector(".color-selector-fill"),
    });

    if (options.replace) {
      this.#addHandlerToResize(parent.parentNode);
      parent.replaceWith(this.#div);
    } else {
      this.#addHandlerToResize(parent);
      parent.append(this.#div);
    }

    window.addEventListener("resize", () => this.resizeCanvas());
    this.#div.addEventListener("transitionend", () => this.resizeCanvas());
    // TODO: Create a Canvas Tool Instance. Remove unnecessary public getters
    // and setters.
  }

  /**
   * The options for DoraemonCanvas.
   * @typedef {Object} Options
   * @property {boolean} replace - whether this doraemon element replaces the
   *                     parent element rather than append to it
   */

  /****************************************************************/
  /*                    Public getters/setters                    */
  /****************************************************************/

  /**
   * Gets the doraemon canvas.
   * @type {HTMLDivElement}
   */
  get div() {
    return this.#div;
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
    const div = this.#div;
    this.#zoomFlag = !this.#zoomFlag;
    if (this.#zoomFlag) {
      this.#origHeight = this.#div.style.height;
      div.style.height = this.#ZOOM_HEIGHT;
      this.#origTransform = this.#div.style.transform;
      div.style.transform = this.#ZOOM_TRANSFORM;
    } else {
      div.style.height = this.#origHeight ?? "100%";
      div.style.transform = this.#origTransform ?? "none";
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
    const doraFace = this.#div.querySelector(".dora-face");
    const { width, height } = doraFace.getBoundingClientRect();
    const scale = parseInt(this.#ZOOM_HEIGHT.replace(/%$/, "")) / 100;
    this.#drawingCanvas.resizeCanvas(scale * width, scale * height);
  }

  /********************************************************/
  /*                    Private fields                    */
  /********************************************************/

  /** @type {HTMLDivElement} #div */
  #div;

  /** @type {boolean} #zoomFlag */
  #zoomFlag;

  /** @type {string} #origHeight */
  #origHeight;

  /** @type {string} #origTransform */
  #origTransform;

  /** @type {DrawingCanvas} #drawingCanvas */
  #drawingCanvas;

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
  <div class="dora-collar-bell"></div>
</div>
<div class="dora-body">
  <div class="dora-tummy">
    <div class="dora-pocket clip-outline">
      <div class="dora-pocket"></div>
    </div>
  </div>
  <div class="dora-feet">
    <div class="dora-foot">
      <div class="dora-foot-shadow">
        <div class="dora-foot-shadow-clip"></div>
      </div>
    </div>
    <div class="dora-foot">
      <div class="dora-foot-shadow">
        <div class="dora-foot-shadow-clip"></div>
      </div>
    </div>
  </div>
</div>
`;
    return div;
  }

  /**
   * Adds handler to resize canvas after doraemon is added to DOM.
   * @param {Node} parent
   */
  #addHandlerToResize(parent) {
    const observer = new MutationObserver(() => {
      for (const child of Array.from(parent.childNodes)) {
        if (child !== this.#div) continue;
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
}

export { DoraemonCanvas };
