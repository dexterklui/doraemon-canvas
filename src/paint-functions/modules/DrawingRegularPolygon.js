import PaintFunction from "./PaintFunction.js";
import { BoundingRect, CanvasItem } from "../external-dependencies.js";

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
    this.updateBoundingRectCoord(...coord);
  }

  onDragging(coord) {
    this.clearDraft();

    const sides = this.numSides;
    let angle = (2 * Math.PI) / sides;
    const coordinates = [];
    const radius = Math.sqrt(
      Math.pow(coord[0] - this.origX, 2) + Math.pow(coord[1] - this.origY, 2)
    );
    let index = 0;

    const acos = Math.acos((coord[0] - this.origX) / radius);
    const initAngle = coord[1] < this.origY ? 2 * Math.PI - acos : acos;

    for (index; index < sides; index++) {
      coordinates.push({
        x: this.origX + radius * Math.cos(angle - initAngle),
        y: this.origY - radius * Math.sin(angle - initAngle),
      });
      angle += (2 * Math.PI) / sides;
    }

    this.contextDraft.beginPath();
    this.contextDraft.moveTo(coordinates[0].x, coordinates[0].y);

    for (index = 0; index < sides; index++) {
      this.contextDraft.lineTo(coordinates[index].x, coordinates[index].y);
    }

    this.contextDraft.closePath();
    this.contextDraft.fill();
    this.contextDraft.stroke();
  }

  onMouseUp(coord) {
    this.clearDraft();
    let sides = this.numSides;
    let angle = (2 * Math.PI) / sides;
    let coordinates = [],
      radius = Math.sqrt(
        Math.pow(coord[0] - this.origX, 2) + Math.pow(coord[1] - this.origY, 2)
      ),
      index = 0;

    const acos = Math.acos((coord[0] - this.origX) / radius);
    const initAngle = coord[1] < this.origY ? 2 * Math.PI - acos : acos;

    for (index; index < sides; index++) {
      const x = this.origX + radius * Math.cos(angle - initAngle);
      const y = this.origY - radius * Math.sin(angle - initAngle);
      this.updateBoundingRectCoord(x, y);
      coordinates.push({ x, y });
      angle += (2 * Math.PI) / sides;
    }

    const x = this.smallX;
    const y = this.smallY;
    const w = this.bigX - this.smallX;
    const h = this.bigY - this.smallY;
    if (w === 0 && h === 0) {
      this.clearBoundingRectCoord();
      return;
    }
    const rect = new BoundingRect(x, y, w, h);
    const path2d = new Path2D();
    path2d.moveTo(coordinates[0].x, coordinates[0].y);
    for (index = 0; index < sides; index++) {
      path2d.lineTo(coordinates[index].x, coordinates[index].y);
    }
    path2d.closePath();
    const canvasItem = new CanvasItem(path2d, rect, this.getStyle());
    canvasItem.draw(this.contextReal);
    this.writeUndoCb(canvasItem);
    this.clearBoundingRectCoord();
  }
}

export { DrawingRegularPolygon };
