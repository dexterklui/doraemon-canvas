import PaintFunction from "./PaintFunction.js";
import { CanvasItem } from "../external-dependencies.js";

/**
 * Functionality to select a CanvasItem and move it.
 * @extends PaintFunction
 */
export default class ItemSelect extends PaintFunction {
  /**
   * @param {CanvasRenderingContext2D} contextReal
   * @param {CanvasRenderingContext2D} contextDraft
   * @param {Function} writeUndoCb - callback that writes current state of
   *                   real canvas to undo history
   * @param {Function} selectCanvasItemCb - callback that accepts a pair coordinates
   *                   and removes selected canvasItems from canvas and returns it.
   */
  constructor(contextReal, contextDraft, writeUndoCb, selectCanvasItemCb) {
    super(contextReal, contextDraft, writeUndoCb);
    this.selectCanvasItemCb = selectCanvasItemCb;
    this.cursorStyle = "default";
    this.updateCursor();
  }

  destructor() {
    if (this.#canvasItem) this.#drawCanvasItem();
    super.destructor();
  }

  /*************************************/
  /*        Handle Mouse Events        */
  /*************************************/
  onMouseDown(coord) {
    if (this.#withinSelection(coord)) {
      this.movingFlag = true;
      this.start = coord;
      return;
    }
    this.clearDraft();
    if (this.#canvasItem) this.#drawCanvasItem();
    this.#canvasItem = null;

    this.#canvasItem = this.selectCanvasItemCb(coord);
    if (!this.#canvasItem) return;
    this.#draftCanvasItem();
    this.#drawSelectionOutline();
    this.contextDraft.canvas.style.cursor = "move";
  }

  onDragging(coord) {
    if (this.movingFlag) {
      this.clearDraft();
      this.#updateCanvasItem(coord);
      this.#draftCanvasItem();
      this.start = coord;
    }
  }

  onMouseUp(coord) {
    if (this.movingFlag) {
      this.clearDraft();
      this.#updateCanvasItem(coord);
      this.#draftCanvasItem();
      this.#drawSelectionOutline();
      this.start = coord;
    }
    this.movingFlag = false;
  }

  onMouseMove(coord) {
    if (!this.#canvasItem) return;
    if (this.#withinSelection(coord)) {
      this.contextDraft.canvas.style.cursor = "move";
      return;
    }
    this.contextDraft.canvas.style.cursor = "default";
  }

  /*******************************/
  /*        Private field        */
  /*******************************/

  /** @type {CanvasItem} #canvasItem */
  #canvasItem;

  /********************************/
  /*        Helper methods        */
  /********************************/

  /**
   * Draws a selection outline on the draft canvas
   */
  #drawSelectionOutline() {
    this.#canvasItem.drawBoundingBox(this.contextDraft);
  }

  /** @param {[number, number]} coord */
  #withinSelection(coord) {
    if (!this.#canvasItem) return false;
    return this.#canvasItem.isOnItem(this.contextDraft, coord);
  }

  #drawCanvasItem() {
    this.#canvasItem.draw(this.contextReal);
    this.writeUndoCb(this.#canvasItem);
  }

  #draftCanvasItem() {
    this.#canvasItem.draw(this.contextDraft);
  }

  #updateCanvasItem(coord) {
    const dx = coord[0] - this.start[0];
    const dy = coord[1] - this.start[1];
    this.#canvasItem.move(dx, dy);
  }
}

export { ItemSelect };
