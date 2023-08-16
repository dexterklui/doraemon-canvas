import { paintFunctions } from "../external-dependencies.js";
import DoraemonCanvas from "./DoraemonCanvas.js";
import "../../coloris/coloris.min.js";

/**
 * @param {string} str
 * @returns {string}
 */
function pascalToSnakeCase(str) {
  return str
    .split(/(?=[A-Z])/)
    .map((str) => str.toLowerCase())
    .join("-");
}

/**
 * @param {string} str
 * @returns {string}
 */
function snakeToPascalCase(str) {
  return str
    .split("-")
    .map((s) => s[0].toUpperCase() + s.substring(1))
    .join("");
}

/**
 * @param {string} str
 * @returns {string}
 */
function snakeToCamelCase(str) {
  const pascalCase = snakeToPascalCase(str);
  return pascalCase[0].toLowerCase() + pascalCase.substring(1);
}

/**
 * A tool panel for a doraemon canvas. Requires Coloris.
 * @param {DoraemonCanvas} canvasApp
 */
export default class ToolPanel {
  constructor(canvasApp) {
    this.#canvasApp = canvasApp;
    this.#mainPanelDiv = this.#createMainPanelDiv();
    this.#tooltip = this.#createTooltip();
    this.#addHandlers();
  }

  /****************************************************************/
  /*                    Public getters/setters                    */
  /****************************************************************/

  /**
   * Gets the doraemon canvas.
   * @type {HTMLDivElement}
   */
  get mainPanelDiv() {
    return this.#mainPanelDiv;
  }

  get tooltipSpan() {
    return this.#tooltip;
  }

  /********************************************************/
  /*                    Private fields                    */
  /********************************************************/

  /** @type {HTMLDivElement} #mainPanelDiv */
  #mainPanelDiv;

  /** @type {DoraemonCanvas} #canvasApp */
  #canvasApp;

  /** @type {HTMLSpanElement} #tooltip */
  #tooltip;

  /*********************************************************/
  /*                    Private methods                    */
  /*********************************************************/

  /** @returns {HTMLDivElement} */
  #createMainPanelDiv() {
    const div = document.createElement("div");
    div.classList.add("tools");
    div.innerHTML = `
<!-- drawing tool buttons -->
<!-- NOTE: id, when turned into PascalCase, must match the class name of its corresponding PaintFunction -->
<div class="tool-btn draw-tool" id="drawing-line">
  <img src="./assets/icons/icon_free-draw.png" alt="Free drawing" />
</div>
<div class="tool-btn draw-tool" id="drawing-straight-line">
  <img src="./assets/icons/icon_line.png" alt="Straight line" />
</div>
<div class="tool-btn draw-tool" id="drawing-quadratic-curve">
  <img src="./assets/icons/icon_quadratic.png" alt="Quadratic curve" />
</div>
<div class="tool-btn draw-tool" id="drawing-bezier-curve">
  <img src="./assets/icons/icon_bezier.png" alt="Cubic curve" />
</div>
<div class="tool-btn draw-tool" id="drawing-circle">
  <img src="./assets/icons/icon_circle.png" alt="Circle" />
</div>
<div class="tool-btn draw-tool" id="drawing-ellipse">
  <img src="./assets/icons/icon_ellipse.png" alt="Ellipse" />
</div>
<div class="tool-btn draw-tool" id="drawing-rectangle">
  <img src="./assets/icons/icon_rectangle.png" alt="Rectangle" />
</div>
<div class="tool-btn draw-tool" id="drawing-regular-polygon">
  <img
    src="./assets/icons/icon_regular-polygon.png"
    alt="Regular polygon"
  />
</div>
<div class="tool-btn draw-tool" id="drawing-irregular-polygon">
  <img src="./assets/icons/icon_polygon.png" alt="Irregular polygon" />
</div>
<div class="tool-btn draw-tool" id="drawing-text">
  <img src="./assets/icons/icon_text.png" alt="Add text" />
</div>
<div class="tool-btn draw-tool" id="add-image">
  <img src="./assets/icons/icon_add-image.png" alt="Add image" />
</div>
<div class="tool-btn draw-tool" id="eraser">
  <img src="./assets/icons/icon_eraser.png" alt="Eraser" />
</div>
<div class="tool-btn draw-tool" id="select-move">
  <img src="./assets/icons/icon_move_2.png" alt="Move area" />
</div>

<!-- Canvas tool buttons (i.e. not setting new PaintFunction) -->
<div class="tool-btn canvas-tool" id="zoom-canvas">
  <img src="./assets/icons/icon_zoom_2.png" alt="Toggle zoom" />
</div>
<!-- but this is draw tool, just for layout sake it is here -->
<div class="tool-btn draw-tool" id="object-move">
  <img src="./assets/icons/icon_pointer.png" alt="Move item" />
</div>
<div class="tool-btn canvas-tool" id="clear-canvas">
  <img src="./assets/icons/icon_clear.png" alt="Clear canvas" />
</div>

<!-- drawing tool specific settings -->
<!-- NOTE: id must have a prefix that, when turned into pascal case, matches
           the class name of its corresponding PaintFunction -->
<!-- NOTE: for input field, if the value (after turning into camelCase) stored
           in the "name" attribute is the target property, then the method
           #generalToolSettingInputHandler() can be used -->
<div id="drawing-regular-polygon-setting" class="tool-with-title tool-setting">
  <p class="tool-title">Side</p>
  <input
    type="number"
    value="3"
    name="num-sides"
    min="3"
    max="99"
  />
</div>
<div id="drawing-text-setting" class="tool-with-title tool-setting">
  <p class="tool-title">Font Size</p>
  <input
    type="range"
    value="20"
    name="font-size"
    min="6"
    max="80"
  />
</div>

<!-- canvas setting -->
<!-- NOTE: for input fields, the value of "name" attribute must be a valid
           property of CanvasRenderingContext2D after turning into camelCase.
           -->
<div class="tool-with-title canvas-setting">
  <p class="tool-title">Line Width</p>
  <input
    type="range"
    max="99"
    min="1"
    name="line-width"
    value="6"
  />
</div>

<!-- colour selectors -->
<!-- NOTE: for input fields, the "name" attribute should be "stroke-style" and
           "fill-style" respectively -->
<!-- Input container is to provide a color selection background to indicate
     transparency -->
<div class="tool-with-title color-selector">
  <p class="tool-title">Stroke</p>
  <div class="input-container">
    <input
      name="stroke-style"
      type="text"
      data-coloris
      value="#ed8a8a"
    />
  </div>
</div>
<div class="tool-with-title color-selector">
  <p class="tool-title">Fill</p>
  <div class="input-container">
    <input
      name="fill-style"
      type="text"
      data-coloris
      value="#6ac7fc"
    />
  </div>
</div>
`;
    div.querySelectorAll(".color-selector input").forEach((input) => {
      // @ts-ignore
      input.style.backgroundColor = input.value;
    });
    return div;
  }

  #createTooltip() {
    const tooltip = document.createElement("span");
    tooltip.classList.add("tool-panel-tooltip");
    return tooltip;
  }

  /** Adds handler to elements on tool panel */
  #addHandlers() {
    this.#addDrawingToolHandlers();
    this.#addToolSettingHandlers();
    this.#addCanvasToolHandlers();
    this.#addCanvasSettingHandlers();
    this.#addColorSettingHandlers();
    this.#addHandlersForTooltip();
  }

  /** Attaches handlers that set paint functions to drawing tool buttons */
  #addDrawingToolHandlers() {
    for (const [name, paintFunction] of Object.entries(paintFunctions)) {
      if (name === "PaintFunction") continue;
      const id = "#" + pascalToSnakeCase(name);
      const btn = this.#mainPanelDiv.querySelector(id);
      const cls = "draw-tool--active";
      btn.addEventListener("click", () => {
        this.#canvasApp.setPaintFunction(paintFunction);
        this.#updateToolSpecificSettings(name);
        this.#mainPanelDiv.querySelector("." + cls)?.classList.remove(cls);
        btn.classList.add(cls);
      });
    }
  }

  /**
   * Updates available tool specific settings according to the given class name
   * of the drawing tool.
   *
   * @param {string} drawToolClassName
   */
  #updateToolSpecificSettings(drawToolClassName) {
    const snakeCase = pascalToSnakeCase(drawToolClassName);
    const cls = "tool-setting--active";
    this.#mainPanelDiv.querySelector("." + cls)?.classList.remove(cls);
    const toolSetting = this.#mainPanelDiv.querySelector(
      "#" + snakeCase + "-setting"
    );
    if (toolSetting) toolSetting.classList.add(cls);
  }

  /**
   * Adds handlers to tool specific settings.
   */
  #addToolSettingHandlers() {
    this.#addDrawingRegularPolygonSettingHandlers();
    this.#addDrawingTextSettingHandlers();
  }

  #addCanvasToolHandlers() {
    this.#mainPanelDiv
      .querySelector("#zoom-canvas")
      .addEventListener("click", () => this.#canvasApp.toggleZoom());
    this.#mainPanelDiv
      .querySelector("#clear-canvas")
      .addEventListener("click", () => this.#canvasApp.clearCanvas());
  }

  /** Loops for all canvas setting, and attaches event handlers */
  #addCanvasSettingHandlers() {
    this.#mainPanelDiv
      .querySelectorAll(".canvas-setting input")
      .forEach((input) => {
        input.addEventListener(
          "blur",
          this.#generalCanvasSettingInputHandler.bind(this)
        );
        input.addEventListener(
          "change",
          this.#generalCanvasSettingInputHandler.bind(this)
        );
      });
  }

  /** Loops for all color selectors, and attaches event handlers */
  #addColorSettingHandlers() {
    this.#mainPanelDiv
      .querySelectorAll(".color-selector input")
      .forEach((selector) => {
        selector.addEventListener("blur", this.#updateColorHandler.bind(this));
        selector.addEventListener(
          "change",
          this.#updateColorHandler.bind(this)
        );
      });
  }

  /** Attaches general handlers to given input element of a tool setting */
  #addGeneralToolSettingInputHandler(element) {
    element.addEventListener(
      "blur",
      this.#generalToolSettingInputHandler.bind(this)
    );
    element.addEventListener(
      "change",
      this.#generalToolSettingInputHandler.bind(this)
    );
  }

  #addDrawingRegularPolygonSettingHandlers() {
    const setting = this.#mainPanelDiv.querySelector(
      "#drawing-regular-polygon-setting"
    );
    const numSidesSetting = setting.querySelector("input[name='num-sides']");
    this.#addGeneralToolSettingInputHandler(numSidesSetting);
  }

  #addDrawingTextSettingHandlers() {
    const setting = this.#mainPanelDiv.querySelector("#drawing-text-setting");
    const fontSizeSetting = setting.querySelector("input[name='font-size']");
    for (const event of ["blur", "change"]) {
      fontSizeSetting.addEventListener(event, (e) => {
        /** @type {HTMLInputElement} target */ // @ts-ignore
        const target = e.target;
        if (!target.checkValidity()) return;
        const value = `${target.value}px arial`;
        this.#canvasApp.setCanvasProperties({ font: value });
      });
    }
  }

  #addHandlersForTooltip() {
    const panel = this.#mainPanelDiv;
    const activeClass = "tool-panel-tooltip--active";
    const tooltip = this.#tooltip;
    const windowWidth = window.innerWidth;

    panel.addEventListener("mousemove", (e) => {
      const cursorAtBottomRight = this.#cursorAtBottomRight(e);
      const hoverTool = panel.querySelector(".tool-btn:hover");
      if (!hoverTool && !cursorAtBottomRight) {
        tooltip.classList.remove(activeClass);
        return;
      }
      if (cursorAtBottomRight) {
        tooltip.textContent = "Drag to resize, double click to reset";
      } else {
        tooltip.textContent = hoverTool
          .querySelector("img")
          .getAttribute("alt");
      }
      const tooltipWidth = tooltip.getBoundingClientRect().width;
      let xCoord;
      const yCoord = e.clientY.toString() + "px";
      if (e.clientX + tooltipWidth > windowWidth) {
        xCoord = (e.clientX - 15 - tooltipWidth).toString() + "px";
      } else {
        xCoord = (e.clientX + 15).toString() + "px";
      }
      tooltip.style.top = yCoord;
      tooltip.style.left = xCoord;
      tooltip.classList.add(activeClass);
    });

    panel.addEventListener("mouseleave", () => {
      tooltip.classList.remove(activeClass);
      tooltip.textContent = "";
    });
  }

  /**
   * Checks if cursor is near the bottom right corner of main tool panel.
   * @param {MouseEvent} e
   * @returns {boolean}
   */
  #cursorAtBottomRight(e) {
    const { width, height } = this.#mainPanelDiv.getBoundingClientRect();
    return width - e.offsetX < 10 && height - e.offsetY < 10;
  }

  /*************************************************************/
  /*                    Handlers definition                    */
  /*************************************************************/

  /**
   * Take the event target HTMLInputElement (input), then get input's name as
   * target property name, input's value as target value, input's type to
   * typecast value. Then change the current PaintFunction instance's property
   * with the value.
   */
  #generalToolSettingInputHandler(e) {
    if (!e.target.checkValidity()) return;
    const paintFunction = this.#canvasApp.getPaintFunction();
    const targetProperty = snakeToCamelCase(e.target.getAttribute("name"));
    let value = e.target.value;
    const inputType = e.target.getAttribute("type");
    if (inputType === "number") value = parseInt(value);
    if (inputType === "range") value = parseInt(value);
    paintFunction[targetProperty] = value;
  }

  /**
   * Take the event target HTMLInputElement (input), then get input's name as
   * target property name, input's value as target value, input's type to
   * typecast value. Then change the canvas property with the value.
   */
  #generalCanvasSettingInputHandler(e) {
    if (!e.target.checkValidity()) return;
    const option = {};
    const targetProperty = snakeToCamelCase(e.target.getAttribute("name"));
    let value = e.target.value;
    const inputType = e.target.getAttribute("type");
    if (inputType === "number") value = parseInt(value);
    if (inputType === "range") value = parseInt(value);
    option[targetProperty] = value;
    this.#canvasApp.setCanvasProperties(option);
  }

  /**
   * Take the name of the input (stroke-style / fill-style) and its value to
   * update the color.
   */
  #updateColorHandler(e) {
    if (!e.target.checkValidity()) return;
    const property = snakeToCamelCase(e.target.getAttribute("name"));
    const color = e.target.value;
    const option = {};
    option[property] = color;
    this.#canvasApp.setCanvasProperties(option);
    e.target.style.backgroundColor = color;
  }
}

export { ToolPanel };
