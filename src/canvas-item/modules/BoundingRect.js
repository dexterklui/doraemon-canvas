/**
 * A bounding rectangular area.
 */
export default class BoundingRect {
  /**
   * @param {number} x - x coord of top left
   * @param {number} y - y coord of top left
   * @param {number} w - width
   * @param {number} h - height
   * @param {number} a - rotation angle in radian at center
   */
  constructor(x, y, w, h, a = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.a = a;
  }

  /** @type {[number, number]} */
  get centerOffset() {
    return [this.w / 2, this.h / 2];
  }

  /** @type {[number, number]} */
  get minusCenterOffset() {
    return [-this.w / 2, -this.h / 2];
  }

  /**
   * Updates the coordinates and/or dimension of the bounding rect if the given
   * point lies beyond the bounding rect.
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   * @returns {boolean} if the bounding rect is changed
   */
  update(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    if (dx < 0) {
      this.w += -dx;
      this.x = x;
    } else if (dx > this.w) {
      this.w = dx;
    }
    if (dy < 0) {
      this.h += -dy;
      this.y = y;
    } else if (dy > this.h) {
      this.h = dy;
    }
  }
}

export { BoundingRect };
