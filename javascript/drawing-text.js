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
    const fontSize = contextReal.font.match(/^\d+px/)[0];
    this.origX = coord[0];
    this.origY = coord[1];
    this.draftInput = document.createElement("input");
    this.draftInput.type = "textarea";
    this.draftInput.style.position = "absolute";
    this.draftInput.style.left = (this.origX - 3).toString() + "px";
    this.draftInput.style.fontSize = fontSize;
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

  /**
   * Creates a control board for changing font style
   */
  createFontStyleControl() {
    const div = document.createElement("div");
    div.id = "font-style-panel";
    for (let size = 10; size <= 50; size += 2) {
      const btn = document.createElement("span");
      btn.classList.add("btn", "btn-info", "fa", "fa-paint-brush", "font-size");
      btn.textContent = size.toString();
      div.append(btn);
    }
    div.addEventListener("click", (e) => {
      // @ts-ignore
      setFontStyle(e.target.textContent);
    });
    const body = document.querySelector("body");
    // XXX: Dunno if setTimeout(,0) is a good practice to prevent the fontStylePanel
    // from removing itself immediately
    setTimeout(() => {
      body.addEventListener("click", function f() {
        const fontStylePanel = document.querySelector("#font-style-panel");
        if (fontStylePanel) {
          fontStylePanel.remove();
          body.removeEventListener("click", f);
        }
      });
    }, 0);
    return div;
  }
}
