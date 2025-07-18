import { useRef, useState } from "react";
import type { RefObject } from "react";
import { useCallback } from "react";

export const useCanvas = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<string[]>([]);
  const [redoPaths, setRedoPaths] = useState<string[]>([]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;

    ctxRef.current = ctx;
  }, [canvasRef]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const ctx = ctxRef.current;
    if (!ctx || !canvasRef.current) return;

    const pos = getEventPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctxRef.current) return;
    const pos = getEventPos(e);
    ctxRef.current.lineTo(pos.x, pos.y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !canvasRef.current) return;

    setIsDrawing(false);
    const url = canvasRef.current.toDataURL();
    setPaths((prev) => [...prev, url]);
    setRedoPaths([]);
    localStorage.setItem("saved-canvas", url);
  };

  const undo = () => {
    if (paths.length === 0 || !canvasRef.current || !ctxRef.current) return;

    const newPaths = [...paths];
    const last = newPaths.pop();
    if (last) setRedoPaths((prev) => [...prev, last]);

    const prevImage = newPaths[newPaths.length - 1];
    const img = new Image();
    img.src = prevImage || "";
    img.onload = () => {
      ctxRef.current!.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      ctxRef.current!.drawImage(img, 0, 0);
    };

    setPaths(newPaths);
    localStorage.setItem("saved-canvas", prevImage || "");
  };

  const redo = () => {
    if (redoPaths.length === 0 || !canvasRef.current || !ctxRef.current) return;

    const newRedo = [...redoPaths];
    const imageToRestore = newRedo.pop();
    if (!imageToRestore) return;

    const img = new Image();
    img.src = imageToRestore;
    img.onload = () => {
      ctxRef.current!.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      ctxRef.current!.drawImage(img, 0, 0);
    };

    setPaths((prev) => [...prev, imageToRestore]);
    setRedoPaths(newRedo);
    localStorage.setItem("saved-canvas", imageToRestore);
  };

  const saveToImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const restoreCanvasFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem("saved-canvas");
    if (!saved || !ctxRef.current || !canvasRef.current) return;

    const img = new Image();
    img.src = saved;
    img.onload = () => {
      ctxRef.current!.drawImage(img, 0, 0);
    };

    setPaths([saved]);
  }, [canvasRef, ctxRef]);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let clientX = 0,
      clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  return {
    initCanvas,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    saveToImage,
    restoreCanvasFromLocalStorage,
  };
};
