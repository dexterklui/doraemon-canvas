class DrawingStraightLine extends PaintFunction {
  /**
   * @param {CanvasRenderingContext2D} contextReal
   * @param {CanvasRenderingContext2D} contextDraft
   */
  constructor(contextReal, contextDraft) {
    super(contextReal, contextDraft);
  }

  onMouseDown(coord, event) {
    this.origX = coord[0];
    this.origY = coord[1];
    this.isDrawing = true;
  }

  onMouseMove(coord, event) {
    if (!this.isDrawing) {
      return;
    }

    // clear canvas and draw line
    this.clearDraft();
    this.contextDraft.beginPath();
    this.contextDraft.moveTo(this.origX, this.origY);
    this.contextDraft.lineTo(coord[0], coord[1]);
    this.contextDraft.stroke();
  }

  onMouseUp(coord, event) {
    this.isDrawing = false;

    this.contextReal.beginPath();
    this.contextReal.moveTo(this.origX, this.origY);
    this.contextReal.lineTo(coord[0], coord[1]);
    this.contextReal.stroke();
  }
}
