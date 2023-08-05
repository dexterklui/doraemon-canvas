class DrawingCircle extends PaintFunction {
  constructor(contextReal, contextDraft) {
    super(contextReal, contextDraft);
  }

  onMouseDown(coord, event) {
    this.origX = coord[0];
    this.origY = coord[1];
  }

  onDragging(coord, event) {
    this.clearDraft();
    let radius = Math.sqrt(Math.pow(Math.abs(coord[0]-this.origX),2) + Math.pow(Math.abs(coord[1]-this.origY),2))
    this.contextDraft.beginPath();
    this.contextDraft.arc(this.origX,this.origY,radius,0,2*Math.PI);
    this.contextDraft.stroke();
  }

  onMouseMove() {}

  onMouseUp(coord) {
    this.clearDraft();
    let radius = Math.sqrt(Math.pow(Math.abs(coord[0]-this.origX),2) + Math.pow(Math.abs(coord[1]-this.origY),2))
    this.contextReal.beginPath();
    this.contextReal.arc(this.origX,this.origY,radius,0,2*Math.PI);
    this.contextReal.stroke();
  }
  onMouseLeave() {}
  onMouseEnter() {}
}
