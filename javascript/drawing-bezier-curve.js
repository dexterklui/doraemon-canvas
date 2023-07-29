/**********************************************
 * Drawing Bezier Curve Functionality
 * ==================================
 * This class extends the PaintFunction class, which you can find in canvas-common
 ***********************************************/
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect

class DrawingBezierCurve extends PaintFunction {
  /**
   * @param {CanvasRenderingContext2D} contextReal
   * @param {CanvasRenderingContext2D} contextDraft
   */
  constructor(contextReal, contextDraft) {
    super(contextReal, contextDraft);
    /**
     * Tracks the stage of drawing bezier curve
     * @type {0|1|2} controlStage
     * 0: drawing initial line
     * 1: placing 1st control point
     * 2: placing 2nd control point
     */
    this.controlStage = 0;
  }

  onMouseDown(coord) {
    switch (this.controlStage) {
      case 0:
        this.origX = coord[0];
        this.origY = coord[1];
        break;
      case 1:
        this.cPt1X = coord[0];
        this.cPt1Y = coord[1];
        break;
      case 2:
        this.clearDraft();
        this.contextReal.beginPath();
        this.contextReal.moveTo(this.origX, this.origY);
        this.contextReal.bezierCurveTo(
          this.cPt1X,
          this.cPt1Y,
          coord[0],
          coord[1],
          this.endX,
          this.endY
        );
        this.contextReal.stroke();
        break;
    }
  }

  onDragging(coord) {
    if (this.controlStage) return;
    this.clearDraft();
    this.contextDraft.beginPath();
    this.contextDraft.moveTo(this.origX, this.origY);
    this.contextDraft.lineTo(coord[0], coord[1]);
    this.contextDraft.stroke();
  }

  onMouseMove(coord) {
    if (dragging) return;
    switch (this.controlStage) {
      case 0:
        return;
      case 1:
        this.clearDraft();
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(this.origX, this.origY);
        this.contextDraft.bezierCurveTo(
          coord[0],
          coord[1],
          this.endX,
          this.endY,
          this.endX,
          this.endY
        );
        this.contextDraft.stroke();
        return;
      case 2:
        this.clearDraft();
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(this.origX, this.origY);
        this.contextDraft.bezierCurveTo(
          this.cPt1X,
          this.cPt1Y,
          coord[0],
          coord[1],
          this.endX,
          this.endY
        );
        this.contextDraft.stroke();
        return;
    }
  }

  // Committing the element to the canvas
  onMouseUp(coord) {
    switch (this.controlStage) {
      case 0:
        this.clearDraft();
        this.endX = coord[0];
        this.endY = coord[1];
        this.contextDraft.beginPath();
        this.contextDraft.moveTo(this.origX, this.origY);
        this.contextDraft.lineTo(this.endX, this.endY);
        this.contextDraft.stroke();
        ++this.controlStage;
        return;
      case 1:
        ++this.controlStage;
        return;
      case 2:
        this.controlStage = 0;
        return;
    }
  }
  onMouseLeave() {}
  onMouseEnter() {}
}
