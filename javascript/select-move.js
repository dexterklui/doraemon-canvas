/**********************************************
 * Move Drawings Within Rectangular Selection Functionality
 * ==================================
 * This class extends the PaintFunction class, which you can find in canvas-common
 ***********************************************/
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect

/**
 * Functionality to select a rectangular area and move drawings within.
 * @extends PaintFunction
 */
class SelectMove extends PaintFunction {
  /**
   * @param {CanvasRenderingContext2D} contextReal
   * @param {CanvasRenderingContext2D} contextDraft
   */
  constructor(contextReal, contextDraft) {
    super(contextReal, contextDraft);
  }

  destructor() {
    if (this.#drawImageData()) this.imageData = undefined;
  }

  /*************************/
  /*        Getters        */
  /*************************/
  get smallerX() {
    return Math.min(this.origX, this.endX);
  }

  get largerX() {
    return Math.max(this.origX, this.endX);
  }

  get smallerY() {
    return Math.min(this.origY, this.endY);
  }

  get largerY() {
    return Math.max(this.origY, this.endY);
  }

  get selectionWidth() {
    if (!this.endX || !this.origX) return;
    return this.largerX - this.smallerX;
  }

  get selectionHeight() {
    if (!this.endY || !this.origY) return;
    return this.largerY - this.smallerY;
  }

  /*************************************/
  /*        Handle Mouse Events        */
  /*************************************/
  onMouseDown(coord) {
    if (this.#withinSelection(coord)) {
      this.movingFlag = true;
      this.dx = coord[0] - this.smallerX;
      this.dy = coord[1] - this.smallerY;
      return;
    }
    if (this.#drawImageData()) this.imageData = undefined;
    this.origX = coord[0];
    this.origY = coord[1];
    this.movingFlag = false;
    this.clearDraft();
  }

  onDragging(coord) {
    if (this.movingFlag) {
      const x = coord[0] - this.dx;
      const y = coord[1] - this.dy;
      this.clearDraft();
      this.contextDraft.putImageData(this.imageData, x, y);
      this.#drawSelectionOutline(x, y);
      return;
    }
    this.clearDraft();
    this.endX = coord[0];
    this.endY = coord[1];
    this.#drawSelectionOutline();
  }

  onMouseUp(coord) {
    if (this.movingFlag) {
      // Need to calculate all before assign them
      const newOrigX = coord[0] - this.dx;
      const newOrigY = coord[1] - this.dy;
      const newEndX = newOrigX + this.selectionWidth;
      const newEndY = newOrigY + this.selectionHeight;
      this.origX = newOrigX;
      this.origY = newOrigY;
      this.endX = newEndX;
      this.endY = newEndY;
      this.clearDraft();
      this.#draftImageData();
      this.#drawSelectionOutline();
      return;
    }
    this.endX = coord[0];
    this.endY = coord[1];
    if (!this.#getImageDataFromSelection()) return;
    this.#clearDrawingInSelection();
    this.#draftImageData();
    this.#drawSelectionOutline();
  }

  /********************************/
  /*        Helper methods        */
  /********************************/
  /**
   * Tests if a pair of coord is within a selection.
   * @param {[number, number]} coord
   * @returns {boolean}
   */
  #withinSelection(coord) {
    if (!this.endX || !this.origX) return false;
    if (coord[0] < this.smallerX || coord[0] > this.largerX) return false;
    if (coord[1] < this.smallerY || coord[1] > this.largerY) return false;
    return true;
  }

  /**
   * Draws a selection outline on the draft canvas
   * @param {number} x - x coordinate of top left corner
   * @param {number} y - y coordinate of top left corner
   * @param {number} w - width of selection
   * @param {number} h - height of selection
   */
  #drawSelectionOutline(
    x = this.smallerX,
    y = this.smallerY,
    w = this.selectionWidth,
    h = this.selectionHeight
  ) {
    this.contextDraft.save();
    this.contextDraft.strokeStyle = "black";
    this.contextDraft.setLineDash([5, 5]);
    this.contextDraft.strokeRect(x, y, w, h);
    this.contextDraft.restore();
  }

  /**
   * Gets and stores image data if selection dimension is not equal to 0
   * @returns {boolean} true if got image data, false otherwise.
   */
  #getImageDataFromSelection() {
    if (this.selectionWidth <= 0 || this.selectionHeight <= 0) return false;
    this.imageData = this.contextReal.getImageData(
      this.smallerX,
      this.smallerY,
      this.selectionWidth,
      this.selectionHeight
    );
    return true;
  }

  /**
   * Puts stored image data onto draft cavas.
   * @returns {boolean} false if no stored image data, true otherwise.
   */
  #draftImageData() {
    if (!this.imageData) return false;
    this.contextDraft.putImageData(
      this.imageData,
      this.smallerX,
      this.smallerY
    );
    return true;
  }

  /**
   * Puts stored image data onto real canvas.
   * @returns {boolean} false if no stored image data found, ture otherwise.
   */
  #drawImageData() {
    if (!this.imageData) return false;
    // Can't putImageData directly, otherwise transparent pixel becomes white
    const canvas = document.createElement("canvas");
    canvas.width = this.selectionWidth;
    canvas.height = this.selectionHeight;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(this.imageData, 0, 0);
    this.contextReal.drawImage(canvas, this.smallerX, this.smallerY);
    return true;
  }

  /**
   * Clears drawing on real canvas inside current selection range.
   */
  #clearDrawingInSelection() {
    this.contextReal.clearRect(
      this.smallerX,
      this.smallerY,
      this.selectionWidth,
      this.selectionHeight
    );
  }
}
