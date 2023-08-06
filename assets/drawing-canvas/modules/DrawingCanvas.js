import { PaintFunction } from "../external-dependencies.js";
import UndoStack from "./UndoStack.js";

/**
 * Allows user to paint on a given canvas under "2d" context using
 * {@link PaintFunction}
 */
export default class DrawingCanvas {
  /**
   * @param {number} [canvasWidth=1280] - default 1280
   * @param {number} [canvasHeight=720] - default 720
   * @param {HTMLElement} [parentElem] - parent element
   * @param {Object<string, any>} [options]
   *        Defaults:
   *        - strokeStyle: "black"
   *        - fillStyle: "black"
   */
  constructor(canvasWidth = 1280, canvasHeight = 720, parentElem, options) {
    this.canvasReal = document.createElement("canvas");
    this.canvasReal.classList.add(
      "drawing-canvas-real",
      "drawing-canvas-real-1"
    );
    this.canvasDraft = document.createElement("canvas");
    this.canvasDraft.classList.add("drawing-canvas-draft");
    this.#setCanvasDimension(canvasWidth, canvasHeight);
    this.#ctxReal = this.canvasReal.getContext("2d");
    this.#ctxDraft = this.canvasDraft.getContext("2d");

    this.#undoStack = new UndoStack();

    this.updateCoordCoefficient();
    this.writeUndo();
    this.setStrokeStyle(options?.strokeStyle ?? "black");
    this.setFillStyle(options?.fillStyle ?? "black");
    this.#setupHandlers();

    this.parentElem = parentElem;
    if (parentElem) parentElem.append(this.canvasReal, this.canvasDraft);
  }

  /*******************************************************/
  /*                    Public fields                    */
  /*******************************************************/

  /** @type {HTMLCanvasElement} canvasReal */
  canvasReal;
  /** @type {HTMLCanvasElement} canvasDraft */
  canvasDraft;

  /********************************************************/
  /*                    Public getters                    */
  /********************************************************/

  /** @returns {CanvasRenderingContext2D} the 2d context of real canvas */
  get ctxReal() {
    return this.#ctxReal;
  }

  /** @returns {CanvasRenderingContext2D} the 2d context of draft canvas */
  get ctxDraft() {
    return this.#ctxDraft;
  }

  /** @returns {PaintFunction} the current PaintFunction */
  get paintFunction() {
    return this.#currentPaintFunction;
  }

  /** @returns {string} an png image data URL for the real canvas */
  get dataUrl() {
    return this.canvasReal.toDataURL();
  }

  /********************************************************/
  /*                    Public setters                    */
  /********************************************************/

  /**
   * Sets the current PaintFunction.
   * @param {PaintFunction} paintFunction
   */
  set paintFunction(paintFunction) {
    this.#currentPaintFunction = paintFunction;
  }

  /********************************************************/
  /*                    Public methods                    */
  /********************************************************/

  /**
   * Sets strokes style for both real and draft canvas
   * @param {string} color
   * @returns {string} the same color
   */
  setStrokeStyle(color) {
    this.#ctxReal.strokeStyle = color;
    this.#ctxDraft.strokeStyle = color;
    return color;
  }

  /**
   * Sets fill style for both real and draft canvas
   * @param {string} color
   * @returns {string} the same color
   */
  setFillStyle(color) {
    this.#ctxReal.fillStyle = color;
    this.#ctxDraft.fillStyle = color;
    return color;
  }

  /**
   * Sets font style for both real and draft canvas
   * @param {number} [size=22]
   * @param {string} [family="arial"] - font family
   */
  setFontStyle(size = 22, family = "arial") {
    const style = `${size.toString()}px ${family}`;
    this.#ctxReal.font = style;
    this.#ctxDraft.font = style;
  }

  /** Clears all drawings on draft canvas. */
  clearDraft() {
    this.#clearCanvas(this.#ctxDraft);
  }

  /** Clears all drawings on both real and draft canvas. */
  clearAll() {
    this.#clearCanvas(this.#ctxDraft, this.#ctxReal);
  }

  writeUndo() {
    const width = this.canvasReal.width;
    const height = this.canvasReal.height;
    this.#undoStack.write(this.#ctxReal.getImageData(0, 0, width, height));
  }

  undo() {
    const imageData = this.#undoStack.undo();
    if (imageData == null) return;
    this.#ctxReal.putImageData(imageData, 0, 0);
  }

  redo() {
    const imageData = this.#undoStack.redo();
    if (imageData == null) return;
    this.#ctxReal.putImageData(imageData, 0, 0);
  }

  // TODO: Can be private?
  /**
   * Updates the coefficient used for correcting coordinates of mouse events
   * under different size of canvas
   */
  updateCoordCoefficient() {
    const { width } = this.canvasDraft.getBoundingClientRect();
    if (!width) {
      this.#coordCoefficient = 0;
      return;
    }
    this.#coordCoefficient = this.canvasDraft.width / width;
  }

  /********************************************************/
  /*                    Private fields                    */
  /********************************************************/

  /** @type {PaintFunction} #currentPaintFunction */
  #currentPaintFunction;
  /**
   * For correcting coordinates of mouse events under different size of
   * canvas
   * @type {number} #coordCoefficient
   */
  #coordCoefficient;
  /** @type {CanvasRenderingContext2D} #ctxReal */
  #ctxReal;
  /** @type {CanvasRenderingContext2D} #ctxDraft */
  #ctxDraft;
  /** @type {ResizeObserver} #resizeObserver */
  #resizeObserver;
  /** @type {boolean} #draggingFlag */
  #draggingFlag;
  /** @type {UndoStack} #undoStack */
  #undoStack;

  /*********************************************************/
  /*                    Private methods                    */
  /*********************************************************/

  /** @param {...CanvasRenderingContext2D} ctxs */
  #clearCanvas(...ctxs) {
    for (const ctx of ctxs) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }

  /******************************/
  /*        Canvas setup        */
  /******************************/

  /**
   * @param {number} width
   * @param {number} height
   */
  #setCanvasDimension(width, height) {
    for (const canvas of [this.canvasReal, this.canvasDraft]) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  #setupHandlers() {
    this.#addDrawingHandlers();
    this.#addResizeHandlers();
  }

  #addResizeHandlers() {
    // TODO: Can improve performance during transition?
    this.#resizeObserver = new ResizeObserver(() => {
      this.updateCoordCoefficient();
    });
    this.#resizeObserver.observe(this.canvasDraft);
  }

  #addDrawingHandlers() {
    this.canvasDraft.addEventListener("mousedown", (e) => {
      const coordX = Math.floor(e.offsetX * this.#coordCoefficient);
      const coordY = Math.floor(e.offsetY * this.#coordCoefficient);
      this.#currentPaintFunction?.onMouseDown([coordX, coordY], e);
      this.#draggingFlag = true;
    });

    this.canvasDraft.addEventListener("mousemove", (e) => {
      const coordX = Math.floor(e.offsetX * this.#coordCoefficient);
      const coordY = Math.floor(e.offsetY * this.#coordCoefficient);
      if (this.#draggingFlag) {
        this.#currentPaintFunction?.onDragging([coordX, coordY], e);
      }
      this.#currentPaintFunction?.onMouseMove([coordX, coordY], e);
    });

    this.canvasDraft.addEventListener("mouseup", (e) => {
      this.#draggingFlag = false;
      const coordX = Math.floor(e.offsetX * this.#coordCoefficient);
      const coordY = Math.floor(e.offsetY * this.#coordCoefficient);
      this.#currentPaintFunction?.onMouseUp([coordX, coordY], e);
    });

    this.canvasDraft.addEventListener("mouseleave", (e) => {
      this.#draggingFlag = false;
      const coordX = Math.floor(e.offsetX * this.#coordCoefficient);
      const coordY = Math.floor(e.offsetY * this.#coordCoefficient);
      this.#currentPaintFunction?.onMouseLeave([coordX, coordY], e);
    });

    this.canvasDraft.addEventListener("mouseenter", (e) => {
      const coordX = Math.floor(e.offsetX * this.#coordCoefficient);
      const coordY = Math.floor(e.offsetY * this.#coordCoefficient);
      this.#currentPaintFunction?.onMouseEnter([coordX, coordY], e);
    });
  }
}

export { DrawingCanvas };
