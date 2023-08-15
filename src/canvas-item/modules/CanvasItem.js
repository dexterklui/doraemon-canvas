import CanvasProperties from "./CanvasProperties.js";
import BoundingRect from "./BoundingRect.js";

/**
 * Represents an item on the canvas in Path2D or DataImage.
 */
export default class CanvasItem {
  /**
   * @param {(Path2D|ImageData)} data
   * @param {BoundingRect} rect
   * @param {CanvasProperties} style
   * @param {[number, number]} [offset]
   * @param {string} [fillStroke] - "stroke", "fill", "fillStroke", "strokeFill"
   */
  constructor(data, rect, style, offset = [0, 0], fillStroke = "fillStroke") {
    if (data instanceof Path2D) {
      this.path = data;
    } else if (data instanceof ImageData) {
      this.imageData = data;
    } else {
      throw new Error("Not a Path2D or ImageData");
    }
    this.rect = rect;
    this.style = style;
    this.offset = offset;
    this.fillStroke = fillStroke;
  }

  /**
   * @returns {Path2D} a Path2D instance of bounding rect after adjustment for
   *                   line width.
   */
  getPath2dRect() {
    let { x, y, w, h } = this.rect;
    if (this.path) {
      // no need to adjust for imageData
      const { lineWidth } = this.style;
      x -= lineWidth * 0.5;
      y -= lineWidth * 0.5;
      w += lineWidth;
      h += lineWidth;
    }
    const path2d = new Path2D();
    path2d.rect(x, y, w, h);
    return path2d;
  }

  /**
   * Moves current item by given dx and dy.
   * @param {number} dx
   * @param {number} dy
   */
  move(dx, dy) {
    const [x, y] = this.offset; // @ts-ignore
    this.offset = [x + dx, y + dy];
  }

  /**
   * Draws current item on a given canvas 2d context.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.save();
    this.#setStyle(ctx);
    this.#transformCtx(ctx);
    if (this.path) {
      switch (this.fillStroke) {
        case "fillStroke":
          ctx.fill(this.path);
        case "stroke":
          ctx.stroke(this.path);
          break;
        case "strokeFill":
          ctx.stroke(this.path);
        case "fill":
          ctx.fill(this.path);
          break;
      }
    } else {
      // Can't putImageData directly, otherwise transparent pixel becomes white
      // XXX: Should I not create a new canvas every time?
      const canvas = document.createElement("canvas");
      canvas.width = this.rect.w;
      canvas.height = this.rect.h;
      canvas.getContext("2d").putImageData(this.imageData, 0, 0);
      ctx.drawImage(canvas, this.rect.x, this.rect.y);
    }
    ctx.restore();
  }

  /**
   * Draws the bounding box adjusted for the line width.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawBoundingBox(ctx) {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "gray";
    ctx.setLineDash([5, 5]);
    this.#transformCtx(ctx);
    ctx.stroke(this.getPath2dRect());
    ctx.restore();
  }

  /**
   * Checks if given coordinate lies on current item.
   * @param {CanvasRenderingContext2D} ctx
   * @param {[number, number]} coord
   */
  isOnItem(ctx, coord) {
    ctx.save();
    this.#transformCtx(ctx);
    let result;
    if (this.path) {
      result = ctx.isPointInPath(this.path, ...coord);
    } else {
      result = ctx.isPointInPath(this.getPath2dRect(), ...coord);
    }
    ctx.restore();
    return result;
  }

  /**
   * @returns {CanvasItem} a cloned copy of this CanvasItem
   */
  clone() {
    let data;
    if (this.path) {
      data = new Path2D(this.path);
    } else {
      data = this.imageData; // TODO: Need to clone?
    }
    const { x, y, w, h, a } = this.rect;
    const rect = new BoundingRect(x, y, w, h, a);
    const style = new CanvasProperties(this.style);
    /** @type {[number, number]} */ // @ts-ignore
    const offset = Array.from(this.offset);
    const fillStroke = this.fillStroke;
    return new CanvasItem(data, rect, style, offset, fillStroke);
  }

  #transformCtx(ctx) {
    ctx.translate(...this.offset);
    if (this.rect.a) {
      ctx.translate(...this.rect.centerOffset);
      ctx.rotate(this.rect.a);
      ctx.translate(...this.rect.minusCenterOffset);
    }
  }

  /**
   * Sets the style of given context. Remember to restore style afterwards.
   * @param {CanvasRenderingContext2D} ctx
   */
  #setStyle(ctx) {
    for (const [key, value] of Object.entries(this.style)) {
      ctx[key] = value;
    }
  }
}

export { CanvasItem };
