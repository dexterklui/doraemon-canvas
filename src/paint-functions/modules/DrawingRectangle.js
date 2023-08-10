import PaintFunction from "./PaintFunction.js";

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function drawRect(ctx, x, y, w, h) {
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
}

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
    drawRect(
      this.contextDraft,
      this.origX,
      this.origY,
      coord[0] - this.origX,
      coord[1] - this.origY
    );
  }

  /** @param {[number, number]} coord */
  onMouseUp(coord) {
    this.clearDraft();
    drawRect(
      this.contextReal,
      this.origX,
      this.origY,
      coord[0] - this.origX,
      coord[1] - this.origY
    );
    this.writeUndoCb();
  }
}

export { DrawingRectangle };
