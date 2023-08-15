import PaintFunction from "./PaintFunction.js";
import { BoundingRect, CanvasItem } from "../external-dependencies.js";

/**
 * Free drawing functionality (like pencil function)
 * @extends PaintFunction
 */
export default class DrawingLine extends PaintFunction {
  constructor(contextReal, contextDraft, writeUndoCb) {
    super(contextReal, contextDraft, writeUndoCb);
    this.cursorStyle = "stroke";
    this.updateCursor();
  }

  /** @param {[number, number]} coord */
  onMouseDown(coord) {
    this.draggingFlag = true;
    this.updateBoundingRectCoord(...coord);
    this.path2d = new Path2D();
    this.path2d.moveTo(...coord);
  }

  /** @param {[number, number]} coord */
  onDragging(coord) {
    this.updateBoundingRectCoord(...coord);
    this.path2d.lineTo(...coord);
    this.contextReal.stroke(this.path2d);
  }

  onMouseUp() {
    this.draggingFlag = false;
    const x = this.smallX;
    const y = this.smallY;
    const w = this.bigX - this.smallX;
    const h = this.bigY - this.smallY;
    if (w === 0 && h === 0) {
      this.clearBoundingRectCoord();
      return;
    }
    const rect = new BoundingRect(x, y, w, h);
    const canvasItem = new CanvasItem(
      this.path2d,
      rect,
      this.getStyle(),
      [0, 0],
      "stroke"
    );
    this.writeUndoCb(canvasItem);
    this.clearBoundingRectCoord();
  }
}

export { DrawingLine };
