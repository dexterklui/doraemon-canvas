import { CanvasItem } from "../external-dependencies.js";
import DrawingCanvas from "./DrawingCanvas.js";

/**
 * An undo stack that stores previous states of a canvas by recording what
 * CanvasItems those states have.
 */
export default class UndoStack {
  /**
   * @param {DrawingCanvas} drawingCanvas
   * @param {number} [maxUndo=50] - Maximum number of states stored in the undo
   *                 stack. Default is 50.
   */
  constructor(drawingCanvas, maxUndo = 50) {
    this.drawingCanvas = drawingCanvas;
    this.maxUndo = maxUndo;
    this.idx = null;
    this.snapshotStack = [];
    this.canvasItemsStack = [];
  }

  /** @type {DrawingCanvas} */
  drawingCanvas;

  /** @type {number} */
  maxUndo;

  /** @type {number} */
  idx;

  /** @type {ImageData[]} */
  snapshotStack;

  /** @type {CanvasItem[][]} */
  canvasItemsStack;

  /** @type {CanvasItem[]} an array of CanvasItem's for current canvas state */
  get canvasItems() {
    return this.canvasItemsStack[this.idx];
  }

  /** @type {ImageData} current snapshot */
  get snapshot() {
    return this.snapshotStack[this.idx];
  }

  /** @type {CanvasRenderingContext2D} */
  get ctxReal() {
    return this.drawingCanvas.ctxReal;
  }

  /**
   * Pushes a new canvas state to the undo stack with a given CanvasItem.
   * @param {?CanvasItem} canvasItem - the new canvasItem to be stored.
   */
  write(canvasItem) {
    const newCanvasItems = this.#cloneCanvasItems();
    if (canvasItem) newCanvasItems.push(canvasItem);
    this.#write(newCanvasItems);
  }

  /**
   * Pushes an empty canvas state to the undo stack.
   */
  pushClearState() {
    this.#write([]);
  }

  /** @returns {(ImageData|null)} the previous state or null */
  undo() {
    if (!this.idx) return null;
    return this.snapshotStack[--this.idx];
  }

  /** @returns {(ImageData|null)} the next state or null */
  redo() {
    if (this.idx == null) return null;
    if (this.idx + 1 >= this.snapshotStack.length) return null;
    return this.snapshotStack[++this.idx];
  }

  /**
   * Checks if coord selects a CanvasItem on canvas. If yes, removes it from real
   * canvas and returns it.
   * @param {[number, number]} coord
   * @returns {?CanvasItem} the {@link CanvasItem} instance or null
   */
  removeCanvasItem(coord) {
    for (let i = this.canvasItems.length - 1; i >= 0; --i) {
      const canvasItem = this.canvasItems[i];
      if (!canvasItem.isOnItem(this.ctxReal, coord)) continue;
      const newCanvasItems = this.#cloneCanvasItems();
      const resultCanvasItem = newCanvasItems.splice(i, 1)[0];
      this.drawingCanvas.redrawCanvasItems(newCanvasItems);
      this.#write(newCanvasItems);
      // Only ObjectMove uses this method. removedCanvasItemFlag tracks
      // whether it is in the process of ObjectMove moving an item. And then
      // later when it writes to undo, we can skip the current undo snapshot
      // (when the item) is temporarily removed from the CanvasItems for
      // ObjectMove to move around.
      this.removedCanvasItemFlag = true;
      return resultCanvasItem;
    }
    return null;
  }

  /**
   * Pushes a new state to undo stack with the given array of CanvasItem's.
   * @param {CanvasItem[]}
   */
  #write(canvasItems) {
    const snapshot = this.drawingCanvas.captureCanvasReal();
    if (this.idx != null) {
      this.snapshotStack.splice(this.idx + 1);
      this.canvasItemsStack.splice(this.idx + 1);
    }
    if (this.removedCanvasItemFlag) {
      this.snapshotStack.pop();
      this.canvasItemsStack.pop();
      this.removedCanvasItemFlag = false;
    }
    this.snapshotStack.push(snapshot);
    this.canvasItemsStack.push(canvasItems);
    if (this.snapshotStack.length > this.maxUndo) {
      this.snapshotStack.splice(0, 1);
      this.canvasItemsStack.splice(0, 1);
    }
    this.idx = this.snapshotStack.length - 1;
  }

  /**
   * Clones an array of CanvasItem's. The elements in the new array are clones
   * of the elements in the old array, i.e. not the same objects.
   * @param {CanvasItem[]} [canvasItems] - default is current canvasItems
   * @returns {CanvasItem[]}
   */
  #cloneCanvasItems(canvasItems = this.canvasItems) {
    if (!canvasItems) return [];
    return Array.from(canvasItems).map((canvasItem) => canvasItem.clone());
  }
}

export { UndoStack };
