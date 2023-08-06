import PaintFunction from "./PaintFunction.js";

/**
 * Free drawing functionality (like pencil function)
 * @extends PaintFunction
 */
export default class DrawingLine extends PaintFunction {
  constructor(contextReal, contextDraft, writeUndoCb) {
    super(contextReal, contextDraft, writeUndoCb);
    this.contextDraft.canvas.style.cursor = "none";
    this.contextDraft.save();
    this.contextDraft.fillStyle = this.contextDraft.strokeStyle;
    this.penRadius = this.contextReal.lineWidth / 2;
  }

  destructor() {
    this.contextDraft.restore();
    super.destructor();
  }

  /** @param {[number, number]} coord */
  onMouseDown(coord) {
    // Kind of line
    this.contextReal.lineJoin = "round";
    // Width of line
    this.contextReal.lineWidth = 5;
    // Drawing the line here
    this.contextReal.beginPath();
    this.contextReal.moveTo(coord[0], coord[1]);
  }

  /** @param {[number, number]} coord */
  onDragging(coord) {
    this.draw(coord[0], coord[1]);
  }

  onMouseUp() {
    this.writeUndoCb();
  }

  /** @param {[number, number]} coord */
  onMouseMove(coord) {
    this.clearDraft();
    this.contextDraft.beginPath();
    this.contextDraft.arc(...coord, this.penRadius, 0, 2 * Math.PI);
    this.contextDraft.fill();
  }

  onMouseLeave() {
    this.clearDraft();
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  draw(x, y) {
    //
    this.contextReal.lineTo(x, y);
    // Draw the line onto the page
    this.contextReal.stroke();
  }
}

export { DrawingLine };
