$(() => {
  /******************************/
  /*        canvas tools        */
  /******************************/
  document.querySelector("#drawing-rectangle").addEventListener("click", () => {
    currentFunction.destructor();
    currentFunction = new DrawingRectangle(contextReal, contextDraft);
  });
  document.querySelector("#drawing-line").addEventListener("click", () => {
    currentFunction.destructor();
    currentFunction = new DrawingLine(contextReal, contextDraft);
  });
  document.querySelector("#select-move").addEventListener("click", () => {
    currentFunction.destructor();
    currentFunction = new SelectMove(contextReal, contextDraft);
  });
  document
    .querySelector("#drawing-bezier-curve")
    .addEventListener("click", () => {
      currentFunction = new DrawingBezierCurve(contextReal, contextDraft);
    });
  document.querySelector("#drawing-polygon").addEventListener("click", () => {
    currentFunction = new DrawingPolygon(contextReal, contextDraft);
  });
  document.querySelector("#drawing-text").addEventListener("click", (e) => {
    if (currentFunction instanceof DrawingText) {
      if (document.querySelector("#font-style-panel")) return;
      const div = currentFunction.createFontStyleControl();
      div.style.position = "absolute";
      div.style.top = "-3em";
      // @ts-ignore
      e.target.after(div);
    }
    currentFunction = new DrawingText(contextReal, contextDraft);
  });

  /*******************************/
  /*        color-picker        */
  /*******************************/
  const colorPalette = document.querySelector(".color-palette");
  const colors = [
    "black",
    "white",
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
  ];
  for (const color of colors) {
    const colorWell = document.createElement("div");
    colorWell.classList.add("color", `color-${color}`);
    colorWell.setAttribute("data-color", color);
    colorWell.style.backgroundColor = color;
    colorPalette.append(colorWell);
  }
  colorPalette.addEventListener("click", (e) => {
    // @ts-ignore
    const color = e.target.getAttribute("data-color");
    setStrokeStyle(color);
    setFillStyle(color);
  });

  /*********************************/
  /*        initial setting        */
  /*********************************/
  currentFunction = new DrawingLine(contextReal, contextDraft);
  setStrokeStyle("black");
  setFillStyle("black");
  setFontStyle();
});
