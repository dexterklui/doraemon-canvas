$(() => {
  /*********************************/
  /*        initial setting        */
  /*********************************/
  currentFunction = new DrawingLine(contextReal);
  setStrokeStyle("black");
  setFillStyle("black");

  /******************************/
  /*        canvas tools        */
  /******************************/
  document.querySelector("#drawing-rectangle").addEventListener("click", () => {
    currentFunction = new DrawingRectangle(contextReal, contextDraft);
  });
  document.querySelector("#drawing-line").addEventListener("click", () => {
    currentFunction = new DrawingLine(contextReal);
  });

  /*******************************/
  /*        color-picker        */
  /*******************************/
  document.querySelector(".color-red").addEventListener("click", () => {
    setStrokeStyle("red");
    setFillStyle("red");
  });
  document.querySelector(".color-green").addEventListener("click", () => {
    setStrokeStyle("green");
    setFillStyle("green");
  });
  document.querySelector(".color-blue").addEventListener("click", () => {
    setStrokeStyle("blue");
    setFillStyle("blue");
  });
});
