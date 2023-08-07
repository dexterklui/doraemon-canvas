// cp stand for control point
function quadraticCurve(ctx, cp, start, end) {
  ctx.beginPath();
  ctx.moveTo(...start);
  ctx.quadraticCurveTo(...cp, ...end);
  ctx.stroke();
}

class DrawingQuadraticCurve extends PaintFunction {
  onMouseDown(coord) {
    if (this.start == null) {
      this.start = coord;
      return;
    }
    if (this.end == null) {
      this.end = coord;
      this.contextDraft.canvas.style.cursor = "default";
      return;
    }
    this.clearDraft();
    quadraticCurve(this.contextReal, coord, this.start, this.end);
    this.contextDraft.canvas.style.cursor = "crosshair";
    this.start = null;
    this.end = null;
  }

  onMouseMove(coord) {
    if (this.start == null) return;
    if (this.end == null) {
      this.clearDraft();
      quadraticCurve(this.contextDraft, coord, this.start, coord);
      return;
    }
    this.clearDraft();
    quadraticCurve(this.contextDraft, coord, this.start, this.end);
  }
}