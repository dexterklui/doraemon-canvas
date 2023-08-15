/**
 * Stores the style of a canvas.
 */
export default class CanvasProperties {
  /**
   * @param {(CanvasRenderingContext2D|CanvasProperties|Object)} input
   */
  constructor(input) {
    this.font = input.font;
    this.strokeStyle = input.strokeStyle;
    this.fillStyle = input.fillStyle;
    this.globalAlpha = input.globalAlpha;
    this.lineWidth = input.lineWidth;
    this.lineCap = input.lineCap;
    this.lineJoin = input.lineJoin;
    this.miterLimit = input.miterLimit;
    this.globalCompositeOperation = input.globalCompositeOperation;
  }

  /** @type {string} */
  font;

  /** @type {string} */
  strokeStyle;

  /** @type {string} */
  fillStyle;

  /** @type {number} */
  globalAlpha;

  /** @type {number} */
  lineWidth;

  /** @type {string} */
  lineCap;

  /** @type {string} */
  lineJoin;

  /** @type {number} */
  miterLimit;

  /** @type {string} */
  globalCompositeOperation;

  *[Symbol.iterator]() {
    if (this.font != null) yield ["font", this.font];
    if (this.strokeStyle != null) yield ["strokeStyle", this.strokeStyle];
    if (this.fillStyle != null) yield ["fillStyle", this.fillStyle];
    if (this.globalAlpha != null) yield ["globalAlpha", this.globalAlpha];
    if (this.lineWidth != null) yield ["lineWidth", this.lineWidth];
    if (this.lineCap != null) yield ["lineCap", this.lineCap];
    if (this.lineJoin != null) yield ["lineJoin", this.lineJoin];
    if (this.miterLimit != null) yield ["miterLimit", this.miterLimit];
    if (this.globalCompositeOperation != null)
      yield ["globalCompositeOperation", this.miterLimit];
  }
}

export { CanvasProperties };
