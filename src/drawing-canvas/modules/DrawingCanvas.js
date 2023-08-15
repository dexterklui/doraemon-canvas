import {
  PaintFunction,
  CanvasItem,
  CanvasProperties,
} from "../external-dependencies.js";
import UndoStack from "./UndoStack.js";

/** @type {Options} DEFAULT_OPTIONS */
const DEFAULT_OPTIONS = {
  canvasWidth: 1280,
  canvasHeight: 720,
  font: "22px ariel",
  strokeStyle: "black",
  fillStyle: "black",
  globalAlpha: 1.0,
  lineWidth: 6,
  lineCap: "round",
  lineJoin: "round",
  miterLimit: 10.0,
};

/**
 * Allows user to paint on a given canvas under "2d" context using
 * {@link PaintFunction}
 */
export default class DrawingCanvas {
  /**
   * @param {Element} [parentElem] - parent element
   * @param {Object} [options] - see {@link Options}
   */
  constructor(parentElem, options = {}) {
    options = { ...DEFAULT_OPTIONS, ...options };
    this.canvasReal = document.createElement("canvas");
    this.canvasReal.classList.add(
      "drawing-canvas-real",
      "drawing-canvas-real-1"
    );
    this.canvasDraft = document.createElement("canvas");
    this.canvasDraft.classList.add("drawing-canvas-draft");
    this.#setCanvasDimension(options.canvasWidth, options.canvasHeight);
    this.#ctxReal = this.canvasReal.getContext("2d");
    this.#ctxDraft = this.canvasDraft.getContext("2d");

    this.#undoStack = new UndoStack(this);
    this.writeUndo();
    this.setCanvasProperties(options);
    this.#setupHandlers();

    this.parentElem = parentElem;
    if (parentElem) parentElem.append(this.canvasReal, this.canvasDraft);

    this.updateCoordCoefficient();
  }

  /**
   * Options for DrawingCanvas
   * @typedef {Object} Options
   * @property {number} canvasWidth
   * @property {number} canvasHeight
   * @property {string} font - e.g. "22px arial"
   * @property {string} strokeStyle
   * @property {string} fillStyle
   * @property {number} globalAlpha - between 0.0 to 1.0
   * @property {number} lineWidth
   * @property {string} lineJoin
   * @property {string} lineCap
   * @property {number} miterLimit
   */

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

  static get DEFAULT_OPTIONS() {
    return DEFAULT_OPTIONS;
  }

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
   * Sets property values for both real and draft canvas, or just the
   * canvas of the given context.
   * @param {Object} props
   * @param {CanvasRenderingContext2D} [ctx]
   */
  setCanvasProperties(props, ctx) {
    for (const [key, value] of Object.entries(props)) {
      if (props[key] == null) continue;
      if (ctx) {
        ctx[key] = value;
        continue;
      }
      this.#ctxReal[key] = value;
      this.#ctxDraft[key] = value;
    }
  }

  /**
   * Gets centain property values for only real canvas.
   * @returns {CanvasProperties}
   */
  getCanvasProperties() {
    return new CanvasProperties(this.#ctxReal);
  }

  /**
   * Takes a snapshot of the whole real canvas.
   * @returns {ImageData}
   */
  captureCanvasReal() {
    const width = this.canvasReal.width;
    const height = this.canvasReal.height;
    return this.ctxReal.getImageData(0, 0, width, height);
  }

  /**
   * Sets strokes style for both real and draft canvas
   * @param {string} color
   * @returns {string} the same color
   */
  setStrokeStyle(color) {
    this.setCanvasProperties({ strokeStyle: color });
    return color;
  }

  /**
   * Sets fill style for both real and draft canvas
   * @param {string} color
   * @returns {string} the same color
   */
  setFillStyle(color) {
    this.setCanvasProperties({ fillStyle: color });
    return color;
  }

  /**
   * Sets font style for both real and draft canvas
   * @param {number} [size=22]
   * @param {string} [family="arial"] - font family
   */
  setFontStyle(size = 22, family = "arial") {
    const style = `${size.toString()}px ${family}`;
    this.setCanvasProperties({ font: style });
  }

  /** Clears all drawings on draft canvas. */
  clearDraft() {
    this.#clearCanvas(this.#ctxDraft);
  }

  /** Clears all drawings and items on both real and draft canvas. */
  clearAll() {
    this.#clearCanvas(this.#ctxDraft, this.#ctxReal);
  }

  /**
   * @param {CanvasItem[]} [canvasItems] - Default is current array of
   *                       CanvasItem's on the undo stack
   */
  redrawCanvasItems(canvasItems) {
    this.clearAll();
    if (!canvasItems) canvasItems = this.#undoStack.canvasItems;
    for (const canvasItem of canvasItems) canvasItem.draw(this.#ctxReal);
  }

  /**
   * Checks if coord selects a CanvasItem on canvas. If yes, removes it from
   * real canvas and returns it.
   * @param {[number, number]} coord
   * @returns {?CanvasItem} the removed CanvasItem or null
   */
  removeCanvasItem(coord) {
    return this.#undoStack.removeCanvasItem(coord);
  }

  /**
   * Writes a new state to undo stack with a given new CanvasItem.
   * @param {CanvasItem} canvasItem - the new CanvasItem to be pushed.
   */
  writeUndo(canvasItem) {
    this.#undoStack.write(canvasItem);
  }

  /**
   * Pushes a new empty state of canvas to undo stack.
   */
  pushClearCanvas() {
    this.clearAll();
    this.#undoStack.pushClearState();
  }

  undo() {
    const imageData = this.#undoStack.undo();
    this.#drawImageData(imageData);
  }

  redo() {
    const imageData = this.#undoStack.redo();
    this.#drawImageData(imageData);
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
    // For perforamnce
    if (Math.abs(this.#coordCoefficient - 1) < 0.001)
      this.#coordCoefficient = 1;
    this.#updateDrawingHandlers();
  }

  /**
   * Resizes canvas to given dimension, or to fit the size of the parent if any
   * one dimension is not given. This is done so that #coordCoefficient can be
   * rest to 1 to enhance perforamnce.
   * @param {number} [width]
   * @param {number} [height]
   */
  resizeCanvas(width, height) {
    if (width == undefined || height == undefined) {
      if (this.parentElem == undefined) return;
      const boundingRect = this.parentElem.getBoundingClientRect();
      width = boundingRect.width;
      height = boundingRect.height;
    }
    if (
      Math.abs(this.canvasReal.width - width) < 1 &&
      Math.abs(this.canvasReal.height - height) < 1
    ) {
      return;
    }
    const styles = this.getCanvasProperties();
    for (const canvas of [this.canvasReal, this.canvasDraft]) {
      canvas.width = width;
      canvas.height = height;
    }
    this.#drawImageData(this.#undoStack.snapshot);
    this.setCanvasProperties(styles);
    this.updateCoordCoefficient();
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
  /** @type {AbortController} #abortController */
  #abortController;

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
    this.#updateDrawingHandlers();
    this.#addResizeHandlers();
  }

  /**
   * Draws ImageData on real canvas. Data is stretched to fill whole canvas if
   * necessary.
   * @param {ImageData} data
   */
  #drawImageData(data) {
    if (data == null) return;
    const width = data.width;
    const height = data.height;
    const canvas = this.canvasReal;
    this.clearAll();
    if (canvas.width === width && canvas.height === height) {
      this.#ctxReal.putImageData(data, 0, 0);
      return;
    }
    const canvasTmp = document.createElement("canvas");
    canvasTmp.width = width;
    canvasTmp.height = height;
    canvasTmp.getContext("2d").putImageData(data, 0, 0);
    this.#ctxReal.drawImage(canvasTmp, 0, 0, canvas.width, canvas.height);
  }

  #addResizeHandlers() {
    // TODO: Can improve performance during transition?
    this.#resizeObserver = new ResizeObserver(() => {
      this.updateCoordCoefficient();
    });
    this.#resizeObserver.observe(this.canvasDraft);
  }

  #updateDrawingHandlers() {
    this.#abortController?.abort();
    this.#abortController = new AbortController();

    if (this.#coordCoefficient === 1) {
      this.canvasDraft.addEventListener("mousedown", this.#mouseDownHandler, {
        signal: this.#abortController.signal,
      });

      this.canvasDraft.addEventListener("mousemove", this.#mouseMoveHandler, {
        signal: this.#abortController.signal,
      });

      this.canvasDraft.addEventListener("mouseup", this.#mouseUpHandler, {
        signal: this.#abortController.signal,
      });

      this.canvasDraft.addEventListener("mouseleave", this.#mouseLeaveHandler, {
        signal: this.#abortController.signal,
      });

      this.canvasDraft.addEventListener("mouseenter", this.#mouseEnterHandler, {
        signal: this.#abortController.signal,
      });
      return;
    }

    this.canvasDraft.addEventListener(
      "mousedown",
      this.#mouseDownAdjustHandler,
      { signal: this.#abortController.signal }
    );

    this.canvasDraft.addEventListener(
      "mousemove",
      this.#mouseMoveAdjustHandler,
      { signal: this.#abortController.signal }
    );

    this.canvasDraft.addEventListener("mouseup", this.#mouseUpAdjustHandler, {
      signal: this.#abortController.signal,
    });

    this.canvasDraft.addEventListener(
      "mouseleave",
      this.#mouseLeaveAdjustHandler,
      { signal: this.#abortController.signal }
    );

    this.canvasDraft.addEventListener(
      "mouseenter",
      this.#mouseEnterAdjustHandler,
      { signal: this.#abortController.signal }
    );
  }

  #mouseDownHandler = (e) => {
    this.#draggingFlag = true;
    this.#currentPaintFunction?.onMouseDown([e.offsetX, e.offsetY], e);
  };
  #mouseMoveHandler = (e) => {
    this.#currentPaintFunction?.onMouseMove([e.offsetX, e.offsetY], e);
    if (this.#draggingFlag) {
      this.#currentPaintFunction?.onDragging([e.offsetX, e.offsetY], e);
    }
  };
  #mouseUpHandler = (e) => {
    this.#draggingFlag = false;
    this.#currentPaintFunction?.onMouseUp([e.offsetX, e.offsetY], e);
  };
  #mouseLeaveHandler = (e) => {
    this.#draggingFlag = false;
    this.#currentPaintFunction?.onMouseLeave([e.offsetX, e.offsetY], e);
  };
  #mouseEnterHandler = (e) => {
    this.#currentPaintFunction?.onMouseEnter([e.offsetX, e.offsetY], e);
  };
  #mouseDownAdjustHandler = (e) => {
    this.#draggingFlag = true;
    const coordX = Math.floor(e.offsetX * this.#coordCoefficient);
    const coordY = Math.floor(e.offsetY * this.#coordCoefficient);
    this.#currentPaintFunction?.onMouseDown([coordX, coordY], e);
  };
  #mouseMoveAdjustHandler = (e) => {
    const coordX = Math.floor(e.offsetX * this.#coordCoefficient);
    const coordY = Math.floor(e.offsetY * this.#coordCoefficient);
    this.#currentPaintFunction?.onMouseMove([coordX, coordY], e);
    if (this.#draggingFlag) {
      this.#currentPaintFunction?.onDragging([coordX, coordY], e);
    }
  };
  #mouseUpAdjustHandler = (e) => {
    this.#draggingFlag = false;
    const coordX = Math.floor(e.offsetX * this.#coordCoefficient);
    const coordY = Math.floor(e.offsetY * this.#coordCoefficient);
    this.#currentPaintFunction?.onMouseUp([coordX, coordY], e);
  };
  #mouseLeaveAdjustHandler = (e) => {
    this.#draggingFlag = false;
    const coordX = Math.floor(e.offsetX * this.#coordCoefficient);
    const coordY = Math.floor(e.offsetY * this.#coordCoefficient);
    this.#currentPaintFunction?.onMouseLeave([coordX, coordY], e);
  };
  #mouseEnterAdjustHandler = (e) => {
    const coordX = Math.floor(e.offsetX * this.#coordCoefficient);
    const coordY = Math.floor(e.offsetY * this.#coordCoefficient);
    this.#currentPaintFunction?.onMouseEnter([coordX, coordY], e);
  };
}

export { DrawingCanvas };
