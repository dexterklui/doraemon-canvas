/**
 * Creates a new ZoomScale that manage the available scale values.
 * @class ZoomScale
 */
class ZoomScale {
  /**
   * @type {number[]} #scales - a list of available scale values
   */
  #scales;

  /**
   * @type {number} #idx - index of current active scale
   */
  #idx;

  /**
   * Creates a new set of zoom scales.
   * @param {...number} scales
   */
  constructor(...scales) {
    if (!scales.length) {
      throw new Error("Cannot create ZoomScale object without any scales");
    }
    if (scales.includes(0)) {
      throw new Error("Scale value cannot be 0");
    }
    this.#scales = scales.sort();
    this.#idx = 0;
  }

  /**
   * Gets a list of all available scale values.
   * @returns {number[]} an array of available scale values.
   */
  get scales() {
    return [...this.#scales];
  }

  /**
   * Gets the current scale.
   * @returns {number} the current scale
   */
  get scale() {
    return this.#scales[this.#idx];
  }

  /**
   * Gets the maximum scale available.
   * @returns {number} the maximum scale available
   */
  get maxScale() {
    return this.#scales[this.#scales.length - 1];
  }

  /**
   * Changes current scale to the next value in the list.
   * @returns {number} the new scale
   */
  next() {
    this.#idx = (this.#idx + 1) % this.#scales.length;
    return this.scale;
  }
}
