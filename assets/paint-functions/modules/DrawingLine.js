import PaintFunction from "./PaintFunction.js";

/**
 * Free drawing functionality (like pencil function)
 * @extends PaintFunction
 */
export default class DrawingLine extends PaintFunction {
  constructor(contextReal, contextDraft, writeUndoCb) {
    super(contextReal, contextDraft, writeUndoCb);
    this.#setCursor();
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

  onMouseEnter() {
    this.#setCursor();
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  draw(x, y) {
    this.contextReal.lineTo(x, y);
    this.contextReal.stroke();
  }

  #setCursor() {
    if (
      this.strokeStyle === this.contextReal.strokeStyle &&
      this.lineWidth === this.contextReal.lineWidth
    )
      return;
    this.strokeStyle = this.contextReal.strokeStyle;
    this.lineWidth = this.contextReal.lineWidth;
    const radius = this.lineWidth / 2;
    const svgStr = `<svg width="${this.lineWidth}" height="${this.lineWidth}" viewBox="0 0 ${this.lineWidth} ${this.lineWidth}" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="${radius}" cy="${radius}" r="${radius}" fill="${this.strokeStyle}"/></svg>`;
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    this.contextDraft.canvas.style.cursor = `url(${url}) ${radius} ${radius}, auto`;
  }
}

export { DrawingLine };
