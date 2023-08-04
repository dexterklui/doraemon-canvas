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
      currentFunction.destructor();
      currentFunction = new DrawingBezierCurve(contextReal, contextDraft);
    });
  document.querySelector("#drawing-polygon").addEventListener("click", () => {
    currentFunction.destructor();
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
    currentFunction.destructor();
    currentFunction = new DrawingText(contextReal, contextDraft);
  });
  document.querySelector("#zoom-canvas").addEventListener("click", () => {
    if (zoomed) {
      dora.style.height = "100%";
      dora.style.transform = "none";
    } else {
      // -- This zooms to show exactly the full canvas --
      // dora.style.height = "170.71%";
      // dora.style.transform = "translateY(-11.5%)";
      // -- This zooms even more --
      dora.style.height = "220%";
      dora.style.transform = "translateY(-15%)";
    }
    // updateCoordCoefficient(); // Needed only if no transition
    zoomed = !zoomed;
  });

  /**************************************/
  /*        Other event handlers        */
  /**************************************/
  window.addEventListener("resize", updateCoordCoefficient);
  dora.addEventListener("transitionend", () => updateCoordCoefficient());
  dora.addEventListener("transitionstart", () => {
    dora.style.pointerEvents = "none";
  });
  dora.addEventListener("transitionend", () => {
    dora.style.pointerEvents = "auto";
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
  updateCoordCoefficient();
});
