class DrawingQuadraticCurve extends PaintFunction {
  constructor(contextReal, contextDraft) {
    super(contextReal, contextDraft);
  }

  onMouseDown(coord, event) {
    this.origX = coord[0];
    this.origY = coord[1];
  }

  onDragging(coord, event) {
    this.clearDraft();
    this.contextDraft.moveTo(this.origX, this.origY);
    this.contextDraft.quadraticCurveTo(coord[0]+100, coord[1]+100, coord[0], coord[1]);
    this.contextDraft.stroke();
  }

  onMouseMove() {}

  onMouseUp(coord) {
    this.clearDraft();
    this.contextReal.moveTo(this.origX, this.origY);
    this.contextReal.quadraticCurveTo(coord[0]+100, coord[1]+100, coord[0], coord[1]);
    this.contextReal.stroke();
  }
  onMouseLeave() {}
  onMouseEnter() {}
}
