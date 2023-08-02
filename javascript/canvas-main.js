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
  window.addEventListener("resize", updateCoordCoefficient);

  /**************************************/
  /*        Other event handlers        */
  /**************************************/
  dora.addEventListener("transitionend", () => updateCoordCoefficient());

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
  updateCoordCoefficient();
});
