import PaintFunction from "./PaintFunction.js";

/**
 * Functionality to draw a regular polygon with given amount of sides.
 * @extends {PaintFunction}
 */
export default class DrawingRegularPolygon extends PaintFunction {
  /**
   * @param {CanvasRenderingContext2D} contextReal
   * @param {CanvasRenderingContext2D} contextDraft
   * @param {Function} [writeUndoCb] - Callback that writes current state of
   *                   real canvas to undo history
   * @param {number} [numSides=3] - number of sides, can be changed later
   */
  constructor(contextReal, contextDraft, writeUndoCb, numSides = 3) {
    super(contextReal, contextDraft, writeUndoCb);
    this.numSides = numSides;
  }

  onMouseDown(coord) {
    this.origX = coord[0];
    this.origY = coord[1];
  }

  onDragging(coord) {
    this.clearDraft();

    const sides = this.numSides;
    let incAngle = (2 * Math.PI) / sides;
    const coordinates = [];
    const radius = Math.sqrt(
      Math.pow(coord[0] - this.origX, 2) + Math.pow(coord[1] - this.origY, 2)
    );
    let index = 0;

    this.contextDraft.save();
    this.contextDraft.translate(this.origX, this.origY);
    const acos = Math.acos((coord[0] - this.origX) / radius);
    const angle = coord[1] < this.origY ? 2 * Math.PI - acos : acos;
    this.contextDraft.rotate(angle);
    this.contextDraft.translate(-this.origX, -this.origY);

    for (index; index < sides; index++) {
      coordinates.push({
        x: this.origX + radius * Math.cos(incAngle),
        y: this.origY - radius * Math.sin(incAngle),
      });
      incAngle += (2 * Math.PI) / sides;
    }

    this.contextDraft.beginPath();
    this.contextDraft.moveTo(coordinates[0].x, coordinates[0].y);

    for (index = 0; index < sides; index++) {
      this.contextDraft.lineTo(coordinates[index].x, coordinates[index].y);
    }

    this.contextDraft.closePath();
    this.contextDraft.stroke();

    this.contextDraft.restore();
  }

  onMouseUp(coord) {
    this.clearDraft();
    let sides = this.numSides;
    let incAngle = (2 * Math.PI) / sides;
    let coordinates = [],
      radius = Math.sqrt(
        Math.pow(coord[0] - this.origX, 2) + Math.pow(coord[1] - this.origY, 2)
      ),
      index = 0;

    this.contextReal.save();
    this.contextReal.translate(this.origX, this.origY);
    const acos = Math.acos((coord[0] - this.origX) / radius);
    const angle = coord[1] < this.origY ? 2 * Math.PI - acos : acos;
    this.contextReal.rotate(angle);
    this.contextReal.translate(-this.origX, -this.origY);

    for (index; index < sides; index++) {
      coordinates.push({
        x: this.origX + radius * Math.cos(incAngle),
        y: this.origY - radius * Math.sin(incAngle),
      });
      incAngle += (2 * Math.PI) / sides;
    }

    this.contextReal.beginPath();
    this.contextReal.moveTo(coordinates[0].x, coordinates[0].y);
    for (index = 0; index < sides; index++) {
      this.contextReal.lineTo(coordinates[index].x, coordinates[index].y);
    }

    this.contextReal.closePath();
    this.contextReal.stroke();

    this.contextReal.restore();
    this.writeUndoCb();
  }
}

export { DrawingRegularPolygon };
