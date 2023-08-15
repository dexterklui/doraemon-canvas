import PaintFunction from "./PaintFunction.js";
import { CanvasItem, BoundingRect } from "../external-dependencies.js";

/**
 * Drawing circle functionality.
 * @extends {PaintFunction}
 */
export default class DrawingCircle extends PaintFunction {
  onMouseDown(coord) {
    this.origX = coord[0];
    this.origY = coord[1];
  }

  onDragging(coord) {
    this.clearDraft();
    let radius = Math.sqrt(
      Math.pow(Math.abs(coord[0] - this.origX), 2) +
        Math.pow(Math.abs(coord[1] - this.origY), 2)
    );
    this.contextDraft.beginPath();
    this.contextDraft.arc(this.origX, this.origY, radius, 0, 2 * Math.PI);
    this.contextDraft.fill();
    this.contextDraft.stroke();
  }

  onMouseUp(coord) {
    this.clearDraft();
    let radius = Math.sqrt(
      Math.pow(Math.abs(coord[0] - this.origX), 2) +
        Math.pow(Math.abs(coord[1] - this.origY), 2)
    );
    if (radius === 0) return;
    const x = this.origX - radius;
    const y = this.origY - radius;
    const w = 2 * radius;
    const h = 2 * radius;
    const path2d = new Path2D();
    path2d.arc(this.origX, this.origY, radius, 0, 2 * Math.PI);
    const rect = new BoundingRect(x, y, w, h);
    const canvasItem = new CanvasItem(path2d, rect, this.getStyle());

    canvasItem.draw(this.contextReal);
    this.writeUndoCb(canvasItem);
  }
}

export { DrawingCircle };
