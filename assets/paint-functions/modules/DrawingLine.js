import PaintFunction from "./PaintFunction.js";

/**
 * Free drawing functionality (like pencil function)
 * @extends PaintFunction
 */
export default class DrawingLine extends PaintFunction {
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
