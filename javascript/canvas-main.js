$(() => {
  currentFunction =  new DrawingLine(contextReal)
  $("#drawing-rectangle").click(() => {
    currentFunction = new DrawingRectangle(contextReal, contextDraft);
  });
  $("#drawing-line").click(() => {
    currentFunction = new DrawingLine(contextReal);
  });  
});
