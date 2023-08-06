/**
 * A superclass for painting functions that draws on a  under "2d"
 * context.
 */
export default class PaintFunction {
  /**
   * @param {CanvasRenderingContext2D} contextReal
   * @param {CanvasRenderingContext2D} contextDraft
   * @param {Function} [writeUndoCb] - Callback that writes current state of
   *                   real canvas to undo history
   */
  constructor(contextReal, contextDraft, writeUndoCb) {
    this.contextReal = contextReal;
    this.contextDraft = contextDraft;
    this.writeUndoCb = writeUndoCb ?? function () {};
  }

  /**
   * Does clean up:
   * - Clears all drawings on draft canvas
   * - Restore cursor style to "auto"
   */
  destructor() {
    this.clearDraft();
    this.contextReal.canvas.style.cursor = "auto";
    this.contextDraft.canvas.style.cursor = "auto";
  }

  /** Clears all drawings on draft canvas */
  clearDraft() {
    const canvasDraft = this.contextDraft.canvas;
    this.contextDraft.clearRect(0, 0, canvasDraft.width, canvasDraft.height);
  }

  /**
   * @param {[number, number]} coord
   * @param {MouseEvent} event
   */
  onMouseDown(coord, event) {}

  /**
   * @param {[number, number]} coord
   * @param {MouseEvent} event
   */
  onDragging(coord, event) {}

  /**
   * @param {[number, number]} coord
   * @param {MouseEvent} event
   */
  onMouseMove(coord, event) {}

  /**
   * @param {[number, number]} coord
   * @param {MouseEvent} event
   */
  onMouseUp(coord, event) {}

  /**
   * @param {[number, number]} coord
   * @param {MouseEvent} event
   */
  onMouseLeave(coord, event) {}

  /**
   * @param {[number, number]} coord
   * @param {MouseEvent} event
   */
  onMouseEnter(coord, event) {}
}

export { PaintFunction };
