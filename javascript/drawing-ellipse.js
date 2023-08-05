class DrawingEllipse extends PaintFunction {
    constructor(contextReal, contextDraft) {
      super(contextReal, contextDraft);
    }
  
    onMouseDown(coord, event) {
      this.origX = coord[0];
      this.origY = coord[1];
    }
  
    onDragging(coord, event) {
      this.clearDraft();
      let w = Math.abs(coord[0]-this.origX);
      let h = Math.abs(coord[1]-this.origY);
      let radius = Math.sqrt(Math.pow(Math.abs(coord[0]-this.origX),2) + Math.pow(Math.abs(coord[1]-this.origY),2));
      this.contextDraft.beginPath();
      this.contextDraft.ellipse(this.origX, this.origY, w, h, 0, 0, 2 * Math.PI);
      this.contextDraft.stroke();
    }
  
    onMouseMove() {}
  
    onMouseUp(coord) {
      this.clearDraft();
      let w = Math.abs(coord[0]-this.origX);
      let h = Math.abs(coord[1]-this.origY);
      let radius = Math.sqrt(Math.pow(Math.abs(coord[0]-this.origX),2) + Math.pow(Math.abs(coord[1]-this.origY),2));
      this.contextReal.beginPath();
      this.contextReal.ellipse(this.origX, this.origY, w, h, 0, 0, 2 * Math.PI);
      this.contextReal.stroke();
    }
    onMouseLeave() {}
    onMouseEnter() {}
  }
  