$(() => {
  /******************************/
  /*        canvas tools        */
  /******************************/
  document.querySelector("#drawing-rectangle").addEventListener("click", () => {
    currentFunction = new DrawingRectangle(contextReal, contextDraft);
  });
  document.querySelector("#drawing-line").addEventListener("click", () => {
    currentFunction = new DrawingLine(contextReal);
  });
  document.querySelector("#drawing-circle").addEventListener("click", () => {
    currentFunction = new DrawingCircle(contextReal, contextDraft);
  });
  document.querySelector("#drawing-ellipse").addEventListener("click", () => {
    currentFunction = new DrawingEllipse(contextReal, contextDraft);
  });
  document.querySelector("#drawing-quadraticCurve").addEventListener("click", () => {
    currentFunction = new DrawingQuadraticCurve(contextReal, contextDraft);
  });
  document.querySelector("#drawing-regularPolygon").addEventListener("click", () => {
    currentFunction = new DrawingRegularPolygon(contextReal, contextDraft);
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
  currentFunction = new DrawingLine(contextReal);
  setStrokeStyle("black");
  setFillStyle("black");
});