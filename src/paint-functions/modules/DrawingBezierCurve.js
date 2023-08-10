import PaintFunction from "./PaintFunction.js";

function bezierCurve(ctx, c1, c2, start, end) {
  ctx.beginPath();
  ctx.moveTo(...start);
  ctx.bezierCurveTo(...c1, ...c2, ...end);
  ctx.stroke();
}

/**
 * Functionality to draw a cubic bezier curve.
 * @extends PaintFunction
 */
export default class DrawingBezierCurve extends PaintFunction {
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
    if (this.start == null) {
      this.start = coord;
      return;
    }
    if (this.end == null) {
      this.end = coord;
      this.contextDraft.canvas.style.cursor = "crosshair";
      return;
    }
    if (this.c1 == null) {
      this.c1 = coord;
      return;
    }
    this.clearDraft();
    bezierCurve(this.contextReal, this.c1, coord, this.start, this.end);
    this.writeUndoCb();
    this.updateCursor();
    this.start = null;
    this.end = null;
    this.c1 = null;
  }

  onMouseMove(coord) {
    if (this.start == null) return;
    if (this.end == null) {
      this.clearDraft();
      bezierCurve(this.contextDraft, this.start, coord, this.start, coord);
      return;
    }
    if (this.c1 == null) {
      this.clearDraft();
      bezierCurve(this.contextDraft, coord, this.end, this.start, this.end);
      return;
    }
    this.clearDraft();
    bezierCurve(this.contextDraft, this.c1, coord, this.start, this.end);
  }
}

export { DrawingBezierCurve };
