import PaintFunction from "./PaintFunction.js";

/**
 * Eraser functionality
 * @extends PaintFunction
 */
export default class Eraser extends PaintFunction {
  constructor(contextReal, contextDraft, writeUndoCb) {
    super(contextReal, contextDraft, writeUndoCb);
    this.updateCursor();
    this.contextReal.globalCompositeOperation = "destination-out";
  }

  destructor() {
    this.contextReal.globalCompositeOperation = "source-over";
    super.destructor();
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

  updateCursor() {
    this.lineWidth = this.contextReal.lineWidth;
    const radius = this.lineWidth / 2;
    const svgStr = `<svg width="${this.lineWidth}" height="${
      this.lineWidth
    }" viewBox="0 0 ${this.lineWidth} ${
      this.lineWidth
    }" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="${radius}" cy="${radius}" r="${
      radius - 2
    }" fill="white" stroke="black"/></svg>`;
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    this.contextDraft.canvas.style.cursor = `url(${url}) ${radius} ${radius}, auto`;
  }
}

export { Eraser };
