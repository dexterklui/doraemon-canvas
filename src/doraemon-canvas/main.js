import DoraemonCanvas from "./modules/DoraemonCanvas.js";

/******************************************************/
/*                    Add doraemon                    */
/******************************************************/

const origCanvasApp = document.querySelector("#canvas-app");
const tooltips = document.querySelector("#tooltips");
/** @type {DoraemonCanvas} doraemon */
const doraemon = new DoraemonCanvas(origCanvasApp, {
  replace: true,
  keyboardShortcuts: true,
});
doraemon.doraDiv.id = "canvas-app";
const canvasToolPanel = doraemon.mainToolPanelDiv;
canvasToolPanel.id = "canvas-tool-panel";
document.querySelector("#canvas-tool-panel").replaceWith(canvasToolPanel);
tooltips.append(doraemon.toolPanelTooltipSpan, doraemon.doraTooltipSpan);

/****************************/
/*        Import CSS        */
/****************************/

const scriptTag = document.querySelector(
  "script[src$='doraemon-canvas/main.js']"
);
const dirPath = scriptTag.getAttribute("src").replace(/main.js$/, "");
const headTag = document.querySelector("head");
const doraemonLinkTag = document.createElement("link");
doraemonLinkTag.href = dirPath + "css/doraemon.css";
doraemonLinkTag.type = "text/css";
doraemonLinkTag.rel = "stylesheet";
headTag.append(doraemonLinkTag);
const toolPanelLinkTag = document.createElement("link");
toolPanelLinkTag.href = dirPath + "css/tool-panel.css";
toolPanelLinkTag.type = "text/css";
toolPanelLinkTag.rel = "stylesheet";
headTag.append(toolPanelLinkTag);
