import { useState, useRef } from "react";
import type { Shape, Point } from "../types/shapes";

const UNDO_KEY = "drawingAppUndoStack";
const REDO_KEY = "drawingAppRedoStack";
const STORAGE_KEY = "drawingAppShapes";
const TOOLBAR_POS_KEY = "drawingAppToolbarPos";
const TOOLBAR_STORAGE_KEY = "drawingAppToolbarSettings";

export const useCanvas = () => {
  const [tool, setTool] = useState<"pencil" | "rect" | "circle" | "fill">(
    "pencil"
  );
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ff0000");
  const [strokeWidth, setStrokeWidth] = useState(3);

  const [shapes, setShapes] = useState<Shape[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved shapes", e);
    }
    return [];
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef<any>(null);

  const [undoStack, setUndoStack] = useState<Shape[][]>(() => {
    try {
      const saved = localStorage.getItem(UNDO_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [redoStack, setRedoStack] = useState<Shape[][]>(() => {
    try {
      const saved = localStorage.getItem(REDO_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  // 포인터 위치 계산
  const getRelativePointerPosition = (stage: any): Point | null => {
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return null;
    const transform = stage.getAbsoluteTransform().copy().invert();
    return transform.point(pointerPos);
  };

  // 마우스 다운
  const handleMouseDown = (e: any) => {
    if (isDrawing) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = getRelativePointerPosition(stage);
    if (!pos) return;

    // Fill 툴일 경우 도형 클릭 처리로 넘긴다
    console.log("MouseDown tool:", tool);
    if (tool === "fill") return;

    setIsDrawing(true);

    if (tool === "pencil") {
      const newLine: Shape = {
        id: `${Date.now()}`,
        type: "line",
        points: [pos.x, pos.y],
        strokeColor,
        strokeWidth,
      };
      setCurrentShape(newLine);
      const newShapes = [...shapes, newLine];
      setShapes(newShapes);
      setUndoStack((prev) => [...prev, shapes]);
      setRedoStack([]);
    } else if (tool === "rect") {
      const newRect: Shape = {
        id: `${Date.now()}`,
        type: "rect",
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        strokeColor,
        strokeWidth,
        fillColor,
      };
      setCurrentShape(newRect);
      const newShapes = [...shapes, newRect];
      setShapes(newShapes);
      setUndoStack((prev) => [...prev, shapes]);
      setRedoStack([]);
    } else if (tool === "circle") {
      const newCircle: Shape = {
        id: `${Date.now()}`,
        type: "circle",
        x: pos.x,
        y: pos.y,
        radius: 0,
        strokeColor,
        strokeWidth,
        fillColor,
      };
      setCurrentShape(newCircle);
      const newShapes = [...shapes, newCircle];
      setShapes(newShapes);
      setUndoStack((prev) => [...prev, shapes]);
      setRedoStack([]);
    }
  };

  // 마우스 무브
  const handleMouseMove = (e: any) => {
    if (!isDrawing || !currentShape) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = getRelativePointerPosition(stage);
    if (!pos) return;

    if (currentShape.type === "line") {
      const newPoints = [...(currentShape.points || []), pos.x, pos.y];
      const updatedLine = { ...currentShape, points: newPoints };
      setCurrentShape(updatedLine);
      setShapes((prev) =>
        prev.map((shape) => (shape.id === updatedLine.id ? updatedLine : shape))
      );
    } else if (currentShape.type === "rect") {
      const newWidth = pos.x - currentShape.x;
      const newHeight = pos.y - currentShape.y;
      const updatedRect = {
        ...currentShape,
        width: newWidth,
        height: newHeight,
      };
      setCurrentShape(updatedRect);
      setShapes((prev) =>
        prev.map((shape) => (shape.id === updatedRect.id ? updatedRect : shape))
      );
    } else if (currentShape.type === "circle") {
      const dx = pos.x - currentShape.x;
      const dy = pos.y - currentShape.y;
      const newRadius = Math.sqrt(dx * dx + dy * dy);
      const updatedCircle = { ...currentShape, radius: newRadius };
      setCurrentShape(updatedCircle);
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === updatedCircle.id ? updatedCircle : shape
        )
      );
    }
  };

  // 마우스 업
  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setCurrentShape(null);
  };

  // Undo
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((r) => [...r, shapes]);
    setShapes(prev);
    setUndoStack((u) => u.slice(0, u.length - 1));
  };

  // Redo
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((u) => [...u, shapes]);
    setShapes(next);
    setRedoStack((r) => r.slice(0, r.length - 1));
  };

  // 삭제
  const handleClearAll = () => {
    if (window.confirm("전체 내용을 삭제하시겠습니까?")) {
      setShapes([]);
      localStorage.removeItem(UNDO_KEY);
      localStorage.removeItem(REDO_KEY);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOOLBAR_POS_KEY);
      localStorage.removeItem(TOOLBAR_STORAGE_KEY);
    }
  };
  const handleShapeClick = (id: string) => {
    console.log("shapeclick tool:", tool);
    if (tool !== "fill") return;

    setUndoStack((prev) => [...prev, shapes]);
    const updated = shapes.map((shape) =>
      shape.id === id ? { ...shape, fillColor } : shape
    );
    setShapes(updated);
    setRedoStack([]);
  };

  return {
    tool,
    setTool,
    strokeColor,
    setStrokeColor,
    fillColor,
    setFillColor,
    strokeWidth,
    setStrokeWidth,
    shapes,
    setShapes,
    isDrawing,
    setIsDrawing,
    stageRef,
    undoStack,
    redoStack,
    currentShape,
    setCurrentShape,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleUndo,
    handleRedo,
    handleClearAll,
    handleShapeClick,
  };
};
