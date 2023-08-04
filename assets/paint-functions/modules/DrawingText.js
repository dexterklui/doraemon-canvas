import PaintFunction from "./PaintFunction.js";

/**
 * Functionality to input text onto the canvas.
 * @extends PaintFunction
 */
export default class DrawingText extends PaintFunction {
  onMouseDown(coord, event) {
    if (this.draftInput) return;
    const fontSize = this.contextReal.font.match(/^\d+px/)[0];
    this.origX = coord[0];
    this.origY = coord[1];
    this.draftInput = document.createElement("input");
    this.draftInput.type = "textarea";
    this.draftInput.style.position = "absolute";
    this.draftInput.style.fontSize = fontSize;
    this.draftInput.style.left = `calc(${event.clientX.toString()}px - 0.4em)`;
    this.draftInput.style.top = `calc(${event.clientY.toString()}px - 1.5em)`;
    this.draftInput.style.zIndex = "100";
    document.body.append(this.draftInput);
    this.draftInput.addEventListener("keydown", (e) => {
      // "vimium" extension makes "Escape" key not registered in keydown event
      if (e.key === "Escape") {
        this.draftInput.remove();
        this.draftInput = null;
      }
    });
    // Need to setTimeout otherwise focus() executes before the input is fully added to DOM
    setTimeout(() => {
      this.draftInput.focus();
      this.draftInput.addEventListener("blur", (e) => {
        if (this.draftInput.value && this.draftInput.value !== "") {
          this.contextReal.fillText(
            this.draftInput.value,
            this.origX,
            this.origY
          );
        }
        this.draftInput.remove();
        this.draftInput = null;
      });
    }, 0);
  }
}

export { DrawingText };
