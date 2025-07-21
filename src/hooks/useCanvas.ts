import { useRef, useState } from "react";
import type { RefObject } from "react";

type Tool = "line" | "rect" | "circle";

export const useCanvas = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>("line");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ffffff");
  const [lineWidth, setLineWidth] = useState(2);

  const startX = useRef(0);
  const startY = useRef(0);
  const snapshot = useRef<ImageData | null>(null);

  const getCtx = () => {
    const canvas = canvasRef.current;
    return canvas?.getContext("2d") ?? null;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = getCtx();
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    startX.current = e.clientX - rect.left;
    startY.current = e.clientY - rect.top;

    snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!ctx || !canvas || !snapshot.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.putImageData(snapshot.current, 0, 0);

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = lineWidth;

    const width = x - startX.current;
    const height = y - startY.current;

    switch (tool) {
      case "line":
        ctx.beginPath();
        ctx.moveTo(startX.current, startY.current);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
      case "rect":
        ctx.beginPath();
        ctx.rect(startX.current, startY.current, width, height);
        ctx.fill();
        ctx.stroke();
        break;
      case "circle":
        ctx.beginPath();
        const radius = Math.sqrt(width * width + height * height);
        ctx.arc(startX.current, startY.current, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const saveToImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "drawing.png";
    a.click();
  };

  return {
    tool,
    strokeColor,
    fillColor,
    lineWidth,
    setTool,
    setStrokeColor,
    setFillColor,
    setLineWidth,
    startDrawing,
    draw,
    stopDrawing,
    saveToImage,
  };
};
