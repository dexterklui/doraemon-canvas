/**
 * An undo stack that stores previous states of a canvas as an ImageData.
 */
export default class UndoStack {
  /**
   * @param {number} [maxUndo=50] - default 50
   */
  constructor(maxUndo = 50) {
    this.maxUndo = maxUndo;
    this.#undoStack = [];
    this.#idx = null;
  }

  /***********************************************************/
  /*                    Public properties                    */
  /***********************************************************/

  /** @returns {(ImageData|null)} the previous state or null */
  undo() {
    if (!this.#idx) return null;
    return this.#undoStack[--this.#idx];
  }

  /** @param {ImageData} data - a new state to store */
  write(data) {
    if (this.#idx != null) this.#undoStack.splice(this.#idx + 1);
    this.#undoStack.push(data);
    if (this.#undoStack.length > this.maxUndo) this.#undoStack.splice(0, 1);
    this.#idx = this.#undoStack.length - 1;
  }

  /** @returns {(ImageData|null)} the next state or null*/
  redo() {
    if (this.#idx == null) return null;
    if (this.#idx + 1 >= this.#undoStack.length) return null;
    return this.#undoStack[++this.#idx];
  }

  /************************************************************/
  /*                    Private properties                    */
  /************************************************************/

  /** @type {ImageData[]} #undoStack */
  #undoStack;
  /** @type {number} #idx */
  #idx;
}

export { UndoStack };
