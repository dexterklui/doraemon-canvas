/**********************************************
 * Drawing Text Functionality
 * ==================================
 * This class extends the PaintFunction class, which you can find in canvas-common
 ***********************************************/
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect

class DrawingText extends PaintFunction {
  /**
   * @param {CanvasRenderingContext2D} contextReal
   * @param {CanvasRenderingContext2D} contextDraft
   */
  constructor(contextReal, contextDraft) {
    super(contextReal, contextDraft);
  }

  onMouseDown(coord) {
    if (this.draftInput) return;
    this.origX = coord[0];
    this.origY = coord[1];
    this.draftInput = document.createElement("input");
    this.draftInput.type = "textarea";
    this.draftInput.style.position = "absolute";
    this.draftInput.style.left = this.origX.toString() + "px";
    this.draftInput.style.top = `calc(${this.origY.toString()}px - 1.2em)`;
    this.draftInput.style.zIndex = "100";
    this.contextDraft.canvas.after(this.draftInput);
    // Need to setTimeout otherwise focus() executes before the input is fully added to DOM
    setTimeout(() => {
      this.draftInput.focus();
      this.draftInput.addEventListener("blur", () => {
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
  onDragging() {}
  onMouseMove() {}
  onMouseUp() {}
  onMouseLeave() {}
  onMouseEnter() {}
}
