import PaintFunction from "./PaintFunction.js";

/**
 * Functionality to draw a filled rectangle.
 * @extends PaintFunction
 */
export default class DrawingRectangle extends PaintFunction {
  /** @param {[number, number]} coord */
  onMouseDown(coord) {
    this.origX = coord[0];
    this.origY = coord[1];
  }

  /** @param {[number, number]} coord */
  onDragging(coord) {
    this.clearDraft();
    this.contextDraft.fillRect(
      this.origX,
      this.origY,
      coord[0] - this.origX,
      coord[1] - this.origY
    );
  }

  /** @param {[number, number]} coord */
  onMouseUp(coord) {
    this.clearDraft();
    this.contextReal.fillRect(
      this.origX,
      this.origY,
      coord[0] - this.origX,
      coord[1] - this.origY
    );
    this.writeUndoCb();
  }
}

export { DrawingRectangle };
