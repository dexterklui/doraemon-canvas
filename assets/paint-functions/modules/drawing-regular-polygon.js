class DrawingRegularPolygon extends PaintFunction {
    constructor(contextReal, contextDraft) {
      super(contextReal, contextDraft);
    }
  
    onMouseDown(coord, event) {
      this.origX = coord[0];
      this.origY = coord[1];
    }
  
    onDragging(coord, event) {
      this.clearDraft();
      let sides = parseInt(document.getElementById("side").value);
      let angle = 2*Math.PI/sides;
      let coordinates = [],
          radius = Math.sqrt(Math.pow((coord[0] - this.origX), 2) + Math.pow((coord[1] - this.origY), 2)),
          index = 0;
  
       for (index; index < sides; index++) {
          coordinates.push({
              x: this.origX + radius * Math.cos(angle),
              y: this.origY - radius * Math.sin(angle)
          })
          angle += (2 * Math.PI) / sides;
      }
  
      this.contextDraft.beginPath();
      this.contextDraft.moveTo(coordinates[0].x, coordinates[0].y);
  
      for (index = 0; index < sides; index++) {
          this.contextDraft.lineTo(coordinates[index].x, coordinates[index].y);
      }
  
      this.contextDraft.closePath();
      this.contextDraft.stroke();
    }
  
    onMouseMove() { }
  
    onMouseUp(coord) {
      this.clearDraft();
      let sides = parseInt(document.getElementById("side").value);
      let angle = 2*Math.PI/sides;
      let coordinates = [],
          radius = Math.sqrt(Math.pow((coord[0] - this.origX), 2) + Math.pow((coord[1] - this.origY), 2)),
          index = 0;
  
       for (index; index < sides; index++) {
          coordinates.push({
              x: this.origX + radius * Math.cos(angle),
              y: this.origY - radius * Math.sin(angle)
          })
          angle += (2 * Math.PI) / sides;
      }
  
      this.contextReal.beginPath();
      this.contextReal.moveTo(coordinates[0].x, coordinates[0].y);
      for (index = 0; index < sides; index++) {
          this.contextReal.lineTo(coordinates[index].x, coordinates[index].y);
      }
  
      this.contextReal.closePath();
      this.contextReal.stroke();
    }
    onMouseLeave() { }
    onMouseEnter() { }
  }
  