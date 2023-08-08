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
    this.cursorStyle = "crosshair";
    this.updateCursor();
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
   * Updates cursor style.
   */
  updateCursor() {
    let style = this.cursorStyle;
    switch (style) {
      case "stroke":
        style = this.strokeCursorStyle();
        break;
      case "strokeFill":
        style = this.strokeFillCursorStyle();
        break;
    }
    if (style) this.contextDraft.canvas.style.cursor = style;
  }

  strokeCursorStyle() {
    this.strokeStyle = this.contextReal.strokeStyle;
    this.lineWidth = this.contextReal.lineWidth;
    const { svgWidth, halfSvgWidth, radius } = this.#cursorVars();
    const svgStr = `<svg width="${svgWidth}" height="${svgWidth}" viewBox="0 0 ${svgWidth} ${svgWidth}" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="${halfSvgWidth}" cy="${halfSvgWidth}" r="${radius}" fill="${this.strokeStyle}"/><path d="M ${halfSvgWidth} 0 V ${svgWidth} M 0 ${halfSvgWidth} H ${svgWidth}" stroke="black" stroke-width="1"/></svg>`;
    return `url(${this.#svgUrl(svgStr)}) ${halfSvgWidth} ${halfSvgWidth}, auto`;
  }

  strokeFillCursorStyle() {
    this.strokeStyle = this.contextReal.strokeStyle;
    this.fillStyle = this.contextReal.fillStyle;
    this.lineWidth = this.contextReal.lineWidth;
    const { svgWidth, halfSvgWidth, fillRadius, strokeWidth } =
      this.#cursorVars();
    const svgStr = `<svg width="${svgWidth}" height="${svgWidth}" viewBox="0 0 ${svgWidth} ${svgWidth}" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="${halfSvgWidth}" cy="${halfSvgWidth}" r="${fillRadius}" stroke="${this.strokeStyle}" fill="${this.fillStyle}" stroke-width="${strokeWidth}"/><path d="M ${halfSvgWidth} 0 V ${svgWidth} M 0 ${halfSvgWidth} H ${svgWidth}" stroke="black" stroke-width="1"/></svg>`;
    return `url(${this.#svgUrl(svgStr)}) ${halfSvgWidth} ${halfSvgWidth}, auto`;
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

  /** @returns {Object} object storing variables needed for svg cursor */
  #cursorVars() {
    const minSvgWidth = 16;
    const radius = this.lineWidth / 2;
    let strokeWidth;
    if (radius < 40) {
      strokeWidth = radius / 4;
    } else {
      strokeWidth = 10;
    }
    const fillRadius = radius - strokeWidth;
    const svgWidth = Math.max(minSvgWidth, this.lineWidth);
    const halfSvgWidth = svgWidth / 2;
    return { svgWidth, halfSvgWidth, radius, fillRadius, strokeWidth };
  }

  /**
   * @param {string} svgStr
   * @returns {string} the blob url containing the resulting svg
   */
  #svgUrl(svgStr) {
    // XXX: memory leak? When cursor no longer use this svg bolb?
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  }
}

export { PaintFunction };
