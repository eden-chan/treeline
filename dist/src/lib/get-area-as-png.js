import { isHTMLCanvasElement } from "./pdfjs-dom.js";
const getAreaAsPNG = (canvas, position) => {
  const { left, top, width, height } = position;
  const doc = canvas ? canvas.ownerDocument : null;
  const newCanvas = doc == null ? void 0 : doc.createElement("canvas");
  if (!newCanvas || !isHTMLCanvasElement(newCanvas)) {
    return "";
  }
  newCanvas.width = width;
  newCanvas.height = height;
  const newCanvasContext = newCanvas.getContext("2d");
  if (!newCanvasContext || !canvas) {
    return "";
  }
  const dpr = window.devicePixelRatio;
  newCanvasContext.drawImage(
    canvas,
    left * dpr,
    top * dpr,
    width * dpr,
    height * dpr,
    0,
    0,
    width,
    height
  );
  return newCanvas.toDataURL("image/png");
};
export {
  getAreaAsPNG
};
