import PaintFunction from "./PaintFunction.js";

// cp stand for control point
function quadraticCurve(ctx, cp, start, end) {
  ctx.beginPath();
  ctx.moveTo(...start);
  ctx.quadraticCurveTo(...cp, ...end);
  ctx.stroke();
}

/**
 * Drawing quadratic curve functionality.
 * @extends {PaintFunction}
 */
export default class DrawingQuadraticCurve extends PaintFunction {
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
    this.clearDraft();
    quadraticCurve(this.contextReal, coord, this.start, this.end);
    this.writeUndoCb();
    this.updateCursor();
    this.start = null;
    this.end = null;
  }

  onMouseMove(coord) {
    if (this.start == null) return;
    this.clearDraft();
    if (this.end == null) {
      quadraticCurve(this.contextDraft, coord, this.start, coord);
      return;
    }
    quadraticCurve(this.contextDraft, coord, this.start, this.end);
  }
}

export { DrawingQuadraticCurve };
