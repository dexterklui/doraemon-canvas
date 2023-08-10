import PaintFunction from "./PaintFunction.js";

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
    let w = Math.abs(coord[0] - this.origX);
    let h = Math.abs(coord[1] - this.origY);
    this.contextDraft.beginPath();
    this.contextDraft.ellipse(this.origX, this.origY, w, h, 0, 0, 2 * Math.PI);
    this.contextDraft.fill();
    this.contextDraft.stroke();
  }

  onMouseUp(coord) {
    this.clearDraft();
    let w = Math.abs(coord[0] - this.origX);
    let h = Math.abs(coord[1] - this.origY);
    this.contextReal.beginPath();
    this.contextReal.ellipse(this.origX, this.origY, w, h, 0, 0, 2 * Math.PI);
    this.contextReal.fill();
    this.contextReal.stroke();
    this.writeUndoCb();
  }
}

export { DrawingEllipse };
