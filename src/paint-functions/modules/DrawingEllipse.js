import PaintFunction from "./PaintFunction.js";
import { BoundingRect, CanvasItem } from "../external-dependencies.js";

/**
 * Drawing ellipse functionality.
 * @extends {PaintFunction}
 */
export default class DrawingEllipse extends PaintFunction {
  onMouseDown(coord) {
    this.origX = coord[0];
    this.origY = coord[1];
  }

  onDragging(coord) {
    this.clearDraft();
    const rx = Math.abs(coord[0] - this.origX);
    const ry = Math.abs(coord[1] - this.origY);
    this.contextDraft.beginPath();
    this.contextDraft.ellipse(
      this.origX,
      this.origY,
      rx,
      ry,
      0,
      0,
      2 * Math.PI
    );
    this.contextDraft.fill();
    this.contextDraft.stroke();
  }

  onMouseUp(coord) {
    this.clearDraft();
    const rx = Math.abs(coord[0] - this.origX);
    const ry = Math.abs(coord[1] - this.origY);
    if (rx === 0 && ry === 0) return;
    const x = this.origX - rx;
    const y = this.origY - ry;
    const w = 2 * rx;
    const h = 2 * ry;
    const path2d = new Path2D();
    path2d.ellipse(this.origX, this.origY, rx, ry, 0, 0, 2 * Math.PI);
    const rect = new BoundingRect(x, y, w, h);
    const canvasItem = new CanvasItem(path2d, rect, this.getStyle());

    canvasItem.draw(this.contextReal);
    this.writeUndoCb(canvasItem);
  }
}

export { DrawingEllipse };
