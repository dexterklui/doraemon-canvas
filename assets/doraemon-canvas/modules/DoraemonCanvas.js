import { DrawingCanvas, PaintFunction } from "../external-dependencies.js";

const DORA_FACE_ASPECT_RATIO = 0.8;
const CANVAS_WIDTH_COEFFICIENT = 0.75;

/**
 * A Doraemon themed canvas that allows user to draw on it.
 */
export default class DoraemonCanvas {
  /**
   * Creates a Doraemon theme canvas
   */
  constructor() {
    this.#div = this.#createDoraemon();

    // Create a DrawingCanvas instance
    const longerDimension = Math.max(window.innerWidth, window.innerHeight);
    const canvasWidth = longerDimension * CANVAS_WIDTH_COEFFICIENT;
    const canvasHeight = canvasWidth * DORA_FACE_ASPECT_RATIO;
    this.#drawingCanvas = new DrawingCanvas(canvasWidth, canvasHeight);
    this.#div
      .querySelector(".dora-face")
      .append(this.#drawingCanvas.canvasReal, this.#drawingCanvas.canvasDraft);

    // TODO: Create a Canvas Tool Instance. Remove unnecessary public getters
    // and setters.
  }

  /********************************************************/
  /*                    Public getters                    */
  /********************************************************/

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

  /********************************************************/
  /*                    Public methods                    */
  /********************************************************/

  /**
   * Toggles zoom in/out to the drawing canvas.
   * @returns {boolean} true if ending in zoom-in state; false for zoom-out
   */
  toggleZoom() {
    this.#zoomFlag = !this.#zoomFlag;
    if (this.#zoomFlag) {
      this.#origHeight = this.#div.style.height;
      this.#div.style.height = this.#ZOOM_HEIGHT;
      this.#origTransform = this.#div.style.transform;
      this.#div.style.transform = this.#ZOOM_TRANSFORM;
    } else {
      this.#div.style.height = this.#origHeight ?? "100%";
      this.#div.style.transform = this.#origTransform ?? "none";
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
    this.#drawingCanvas.setStrokeStyle(color);
  }

  /**
   * Sets new fill style.
   * @param {string} color
   */
  setFillStyle(color) {
    this.#drawingCanvas.setFillStyle(color);
  }

  /**
   * Sets font style.
   * @param {number} [size=22]
   * @param {string} [family="arial"] - font family
   */
  setFontStyle(size = 22, family = "arial") {
    this.#drawingCanvas.setFontStyle(size, family);
  }

  /** Undo previous draw operation */
  undo() {
    this.#drawingCanvas.undo();
  }

  /** Redo previous undone draw operation */
  redo() {
    this.#drawingCanvas.redo();
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
}

export { DoraemonCanvas };
