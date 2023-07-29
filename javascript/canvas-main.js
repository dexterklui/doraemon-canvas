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
  document.querySelector(".color-black").addEventListener("click", () => {
    setStrokeStyle("black");
    setFillStyle("black");
  });
  document.querySelector(".color-white").addEventListener("click", () => {
    setStrokeStyle("white");
    setFillStyle("white");
  });
  document.querySelector(".color-red").addEventListener("click", () => {
    setStrokeStyle("red");
    setFillStyle("red");
  });
  document.querySelector(".color-orange").addEventListener("click", () => {
    setStrokeStyle("orange");
    setFillStyle("orange");
  });
  document.querySelector(".color-yellow").addEventListener("click", () => {
    setStrokeStyle("yellow");
    setFillStyle("yellow");
  });
  document.querySelector(".color-green").addEventListener("click", () => {
    setStrokeStyle("green");
    setFillStyle("green");
  });
  document.querySelector(".color-blue").addEventListener("click", () => {
    setStrokeStyle("blue");
    setFillStyle("blue");
  });
  document.querySelector(".color-purple").addEventListener("click", () => {
    setStrokeStyle("purple");
    setFillStyle("purple");
  });
  document.querySelector(".color-pink").addEventListener("click", () => {
    setStrokeStyle("pink");
    setFillStyle("pink");
  });
});
