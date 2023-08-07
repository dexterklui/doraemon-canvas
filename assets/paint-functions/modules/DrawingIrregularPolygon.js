import PaintFunction from "./PaintFunction.js";

/**
 * Functionality to draw a polygon with arbitrary sides.
 * @extends PaintFunction
 */
export default class DrawingIrregularPolygon extends PaintFunction {
  /**
   * @param {CanvasRenderingContext2D} contextReal
   * @param {CanvasRenderingContext2D} contextDraft
   * @param {Function} [writeUndoCb]
   */
  constructor(contextReal, contextDraft, writeUndoCb) {
    super(contextReal, contextDraft, writeUndoCb);
    this.coords = [];
  }

  onMouseDown(coord) {
    if (this.coords.length && this.distance(this.coords[0], coord) < 10) {
      this.clearDraft();
      this.drawPartialPolygon(this.contextReal);
      this.contextReal.closePath();
      this.contextReal.stroke();
      this.contextReal.fill();
      this.writeUndoCb();
      this.coords = [];
      return;
    }
    this.coords.push(coord);
    this.drawPartialPolygon(this.contextDraft);
  }

  onMouseMove(coord) {
    if (!this.coords.length) return;
    this.clearDraft();
    this.drawPartialPolygon(this.contextDraft);
    this.contextDraft.lineTo(coord[0], coord[1]);
    this.contextDraft.stroke();
  }

  /**
   * Begin a new path a draw lines, but doesn't clear canvas nor stroke or fill.
   */
  drawPartialPolygon(context) {
    const coords = this.coords;
    context.beginPath();
    context.moveTo(coords[0][0], coords[0][1]);
    for (let i = 1; i < coords.length; ++i) {
      context.lineTo(coords[i][0], coords[i][1]);
    }
  }

  distance(coord1, coord2) {
    return Math.sqrt(
      (coord1[0] - coord2[0]) ** 2 + (coord1[1] - coord2[1]) ** 2
    );
  }
}

export { DrawingIrregularPolygon };
