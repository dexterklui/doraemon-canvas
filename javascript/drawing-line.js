/**********************************************
 * Drawing Line Functionality
 * ==================================
 * This class extends the PaintFunction class, which you can find in canvas-common
 * Remember, order matters
 ***********************************************/
class DrawingLine extends PaintFunction {
  // This class extends the PaintFunction class
  // You are only passing one instance here

  /**
   * @param {CanvasRenderingContext2D} contextReal
   */
  constructor(contextReal, contextDraft) {
    super(contextReal, contextDraft);
  }

  // On mouse down, ensure that the pen has these features
  onMouseDown(coord, event) {
    // Kind of line
    this.contextReal.lineJoin = "round";
    // Width of line
    this.contextReal.lineWidth = 5;
    // Drawing the line here
    this.contextReal.beginPath();
    this.contextReal.moveTo(coord[0], coord[1]);
  }
  // Clicking and removing your mouse
  onDragging(coord, event) {
    this.draw(coord[0], coord[1]);
  }

  onMouseMove() {}
  onMouseUp() {}
  onMouseLeave() {}
  onMouseEnter() {}

  /**
   * @param {number} x
   * @param {number} y
   */
  draw(x, y) {
    //
    this.contextReal.lineTo(x, y);
    // Draw the line onto the page
    this.contextReal.stroke();
  }
}
