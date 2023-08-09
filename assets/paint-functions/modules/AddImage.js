import PaintFunction from "./PaintFunction.js";

/**
 * Functionality to add an image to the canvas.
 * @extends PaintFunction
 */
export default class AddImage extends PaintFunction {
  constructor(contextReal, contextDraft, writeUndoCb) {
    super(contextReal, contextDraft, writeUndoCb);

    // XXX: Dunno if there will be memory leak, even after removing the event
    // listeners
    const img = new Image();
    const input = document.createElement("input");
    const canvas = this.contextDraft.canvas;
    const ctx = this.contextDraft;
    const drawImgOnLoad = () => {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const wScale = canvas.width / imgWidth;
      const hScale = canvas.height / imgHeight;
      const fitScale = Math.min(wScale, hScale);
      const width = fitScale < 1 ? imgWidth * fitScale : imgWidth;
      const height = fitScale < 1 ? imgHeight * fitScale : imgHeight;
      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;
      ctx.drawImage(img, x, y, width, height);
      this.origX = x;
      this.origY = y;
      this.endX = x + width;
      this.endY = y + height;
      this.#getImageDataFromSelection(true);
      this.#drawSelectionOutline();

      img.removeEventListener("load", drawImgOnLoad);
    };

    img.addEventListener("load", drawImgOnLoad);

    input.type = "file";
    input.addEventListener("change", function onChange(e) {
      // @ts-ignore
      const file = e.target.files[0];
      if (!file) {
        input.removeEventListener("change", onChange);
        img.removeEventListener("load", drawImgOnLoad);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        /** @type {string} result */ // @ts-ignore
        const result = e.target.result;
        if (!/^data:image/.test(result)) {
          img.removeEventListener("load", drawImgOnLoad);
          return;
        }
        img.src = result;
      };
      reader.readAsDataURL(file);
      input.removeEventListener("change", onChange);
    });
    input.click();
  }

  destructor() {
    if (this.#drawImageData()) this.imageData = undefined;
    super.destructor();
  }

  /*************************/
  /*        Getters        */
  /*************************/
  // NOTE: These getters assume no undefined values

  get smallerX() {
    return this.origX <= this.endX ? this.origX : this.endX;
  }

  get largerX() {
    return this.origX > this.endX ? this.origX : this.endX;
  }

  get smallerY() {
    return this.origY <= this.endY ? this.origY : this.endY;
  }

  get largerY() {
    return this.origY > this.endY ? this.origY : this.endY;
  }

  get selectionWidth() {
    return this.origX <= this.endX
      ? this.endX - this.origX
      : this.origX - this.endX;
  }

  get selectionHeight() {
    return this.origY <= this.endY
      ? this.endY - this.origY
      : this.origY - this.endY;
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
    this.endX = undefined;
    this.endY = undefined;
    this.movingFlag = false;
    this.clearDraft();
  }

  onDragging(coord) {
    if (this.movingFlag) {
      this.#updateSelection(coord);
      this.clearDraft();
      this.#draftImageData();
      this.#drawSelectionOutline();
      return;
    }
    this.clearDraft();
    this.endX = coord[0];
    this.endY = coord[1];
    this.#drawSelectionOutline();
  }

  onMouseUp(coord) {
    if (this.movingFlag) {
      this.#updateSelection(coord);
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

  onMouseMove(coord) {
    if (this.#withinSelection(coord)) {
      this.contextDraft.canvas.style.cursor = "move";
    } else {
      this.contextDraft.canvas.style.cursor = "crosshair";
    }
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
    if (this.endX == undefined || !this.origX == undefined) return false;
    if (coord[0] < this.smallerX || coord[0] >= this.largerX) return false;
    if (coord[1] < this.smallerY || coord[1] >= this.largerY) return false;
    return true;
  }

  /**
   * Updates selection area using dx, dy and a given coord.
   * @param {[number, number]} coord
   */
  #updateSelection(coord) {
    // Need to calculate all before assigning them.
    const newOrigX = coord[0] - this.dx;
    const newOrigY = coord[1] - this.dy;
    const newEndX = newOrigX + this.selectionWidth;
    const newEndY = newOrigY + this.selectionHeight;
    this.origX = newOrigX;
    this.origY = newOrigY;
    this.endX = newEndX;
    this.endY = newEndY;
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
    this.contextDraft.lineWidth = 2;
    this.contextDraft.strokeStyle = "gray";
    this.contextDraft.setLineDash([5, 5]);
    this.contextDraft.strokeRect(x, y, w, h);
    this.contextDraft.restore();
  }

  /**
   * Gets and stores image data if selection dimension is not equal to 0
   * @param {boolean} [fromDraft=false] - whether to gets image data from
   *                  canvasDraft instead of canvasReal
   * @returns {boolean} true if got image data, false otherwise.
   */
  #getImageDataFromSelection(fromDraft = false) {
    const ctx = fromDraft ? this.contextDraft : this.contextReal;
    if (this.selectionWidth <= 0 || this.selectionHeight <= 0) return false;
    this.imageData = ctx.getImageData(
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
    this.writeUndoCb();
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

export { AddImage };
