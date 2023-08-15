import PaintFunction from "./PaintFunction.js";
import { BoundingRect, CanvasItem } from "../external-dependencies.js";

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
    const x = Math.min(this.origX, coord[0]);
    const y = Math.min(this.origY, coord[1]);
    const w = Math.abs(coord[0] - this.origX);
    const h = Math.abs(coord[1] - this.origY);
    if (w === 0 && h === 0) return;
    const path2d = new Path2D();
    path2d.rect(x, y, w, h);
    const rect = new BoundingRect(x, y, w, h);
    const canvasItem = new CanvasItem(path2d, rect, this.getStyle());

    canvasItem.draw(this.contextReal);
    this.writeUndoCb(canvasItem);
  }
}

export { DrawingRectangle };
