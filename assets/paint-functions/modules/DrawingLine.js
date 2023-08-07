import PaintFunction from "./PaintFunction.js";

/**
 * Free drawing functionality (like pencil function)
 * @extends PaintFunction
 */
export default class DrawingLine extends PaintFunction {
  constructor(contextReal, contextDraft, writeUndoCb) {
    super(contextReal, contextDraft, writeUndoCb);
    this.contextDraft.canvas.style.cursor = "none";
    this.#prerenderCursorCanvas();
  }

  /** @param {[number, number]} coord */
  onMouseDown(coord) {
    this.draggingFlag = true;
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
    this.draggingFlag = false;
    this.writeUndoCb();
  }

  /** @param {[number, number]} coord */
  onMouseMove(coord) {
    if (this.draggingFlag) return;
    const x = coord[0] - this.radius;
    const y = coord[1] - this.radius;
    this.clearDraft();
    this.contextDraft.drawImage(this.cursorCanvas, x, y);
  }

  onMouseLeave() {
    this.clearDraft();
  }

  onMouseEnter() {
    this.#prerenderCursorCanvas();
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

  #prerenderCursorCanvas() {
    if (
      this.strokeStyle === this.contextReal.strokeStyle &&
      this.lineWidth === this.contextReal.lineWidth
    )
      return;
    this.strokeStyle = this.contextReal.strokeStyle;
    this.lineWidth = this.contextReal.lineWidth;
    this.radius = this.lineWidth / 2;
    this.cursorCanvas = document.createElement("canvas");
    const ctx = this.cursorCanvas.getContext("2d");
    this.cursorCanvas.width = this.lineWidth;
    this.cursorCanvas.height = this.lineWidth;
    ctx.fillStyle = this.strokeStyle;
    ctx.beginPath();
    ctx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export { DrawingLine };
