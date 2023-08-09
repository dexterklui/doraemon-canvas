import PaintFunction from "./PaintFunction.js";

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
    this.contextReal.beginPath();
    this.contextReal.moveTo(coord[0], coord[1]);
  }

  /** @param {[number, number]} coord */
  onDragging(coord) {
    this.draw(coord[0], coord[1]);
  }

  onMouseUp() {
    this.draggingFlag = false;
    this.writeUndoCb();
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  draw(x, y) {
    this.contextReal.lineTo(x, y);
    this.contextReal.stroke();
  }
}

export { DrawingLine };
