import PaintFunction from "./PaintFunction.js";
import { BoundingRect, CanvasItem } from "../external-dependencies.js";

/**
 * Drawing straight line functionality.
 * @extends PaintFunction
 */
export default class DrawingStraightLine extends PaintFunction {
  /**
   * @param {CanvasRenderingContext2D} contextReal
   * @param {CanvasRenderingContext2D} contextDraft
   * @param {Function} [writeUndoCb]
   */
  constructor(contextReal, contextDraft, writeUndoCb) {
    super(contextReal, contextDraft, writeUndoCb);
    this.cursorStyle = "stroke";
    this.updateCursor();
  }

  onMouseDown(coord) {
    this.origX = coord[0];
    this.origY = coord[1];
    this.isDrawing = true;
  }

  onMouseMove(coord) {
    if (!this.isDrawing) return;

    // clear canvas and draw line
    this.clearDraft();
    this.contextDraft.beginPath();
    this.contextDraft.moveTo(this.origX, this.origY);
    this.contextDraft.lineTo(coord[0], coord[1]);
    this.contextDraft.stroke();
  }

  onMouseUp(coord) {
    this.isDrawing = false;

    const x = Math.min(this.origX, coord[0]);
    const y = Math.min(this.origY, coord[1]);
    const w = Math.abs(coord[0] - this.origX);
    const h = Math.abs(coord[1] - this.origY);
    if (w === 0 && h === 0) return;
    const path2d = new Path2D();
    path2d.moveTo(this.origX, this.origY);
    path2d.lineTo(coord[0], coord[1]);
    const rect = new BoundingRect(x, y, w, h);
    const canvasItem = new CanvasItem(
      path2d,
      rect,
      this.getStyle(),
      [0, 0],
      "stroke"
    );
    canvasItem.draw(this.contextReal);
    this.writeUndoCb(canvasItem);
  }
}

export { DrawingStraightLine };
