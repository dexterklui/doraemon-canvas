import PaintFunction from "./PaintFunction.js";

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

    this.contextReal.beginPath();
    this.contextReal.moveTo(this.origX, this.origY);
    this.contextReal.lineTo(coord[0], coord[1]);
    this.contextReal.stroke();
    this.writeUndoCb();
  }
}

export { DrawingStraightLine };
