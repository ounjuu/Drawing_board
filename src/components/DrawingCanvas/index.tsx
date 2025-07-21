import React, { useState, useRef } from "react";
import { Stage, Layer, Line, Rect, Circle } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";

import type { Shape, Point } from "../../types/shapes";
import Toolbar from "../Toolbar";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CanvasWrapper = styled.div`
  border: 1px solid #ccc;
  margin-top: 10px;
`;

const DrawingCanvas = () => {
  const [tool, setTool] = useState<"pencil" | "rect" | "circle">("pencil");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ff0000");
  const [strokeWidth, setStrokeWidth] = useState(3);

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef<any>(null);

  // Undo/Redo 스택
  const [undoStack, setUndoStack] = useState<Shape[][]>([]);
  const [redoStack, setRedoStack] = useState<Shape[][]>([]);

  // 현재 그리는 도형 상태 (선/도형)
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  // Helper: 현재 마우스 위치 가져오기
  const getRelativePointerPosition = (stage: any): Point | null => {
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return null;
    const transform = stage.getAbsoluteTransform().copy().invert();
    return transform.point(pointerPos);
  };

  // 마우스 다운 이벤트
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (isDrawing) return; // 이미 그리는 중이면 무시
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = getRelativePointerPosition(stage);
    if (!pos) return;

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
      setShapes((prev) => [...prev, newLine]);
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
      setShapes((prev) => [...prev, newRect]);
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
      setShapes((prev) => [...prev, newCircle]);
      setUndoStack((prev) => [...prev, shapes]);
      setRedoStack([]);
    }
  };

  // 마우스 무브 이벤트
  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !currentShape) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = getRelativePointerPosition(stage);
    if (!pos) return;

    if (currentShape.type === "line") {
      // line points 업데이트
      const newPoints = [...(currentShape.points || []), pos.x, pos.y];
      const updatedLine = { ...currentShape, points: newPoints };
      setCurrentShape(updatedLine);
      setShapes((prev) =>
        prev.map((shape) => (shape.id === updatedLine.id ? updatedLine : shape))
      );
    } else if (currentShape.type === "rect") {
      // rect width, height 업데이트
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
      // radius는 원점과 현재 포인터 거리 계산
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

  // 마우스 업 이벤트
  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setCurrentShape(null);
  };

  // Undo 함수
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((r) => [...r, shapes]);
    setShapes(prev);
    setUndoStack((u) => u.slice(0, u.length - 1));
  };

  // Redo 함수
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((u) => [...u, shapes]);
    setShapes(next);
    setRedoStack((r) => r.slice(0, r.length - 1));
  };

  return (
    <Container>
      <Toolbar
        tool={tool}
        setTool={setTool}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        fillColor={fillColor}
        setFillColor={setFillColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />
      <CanvasWrapper>
        <Stage
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={stageRef}
          style={{ backgroundColor: "#fff" }}
        >
          <Layer>
            {shapes.map((shape) => {
              switch (shape.type) {
                case "line":
                  return (
                    <Line
                      key={shape.id}
                      points={shape.points}
                      stroke={shape.strokeColor}
                      strokeWidth={shape.strokeWidth}
                      tension={0.5}
                      lineCap="round"
                      globalCompositeOperation="source-over"
                    />
                  );
                case "rect":
                  return (
                    <Rect
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      stroke={shape.strokeColor}
                      strokeWidth={shape.strokeWidth}
                      fill={shape.fillColor}
                    />
                  );
                case "circle":
                  return (
                    <Circle
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      radius={shape.radius}
                      stroke={shape.strokeColor}
                      strokeWidth={shape.strokeWidth}
                      fill={shape.fillColor}
                    />
                  );
                default:
                  return null;
              }
            })}
          </Layer>
        </Stage>
      </CanvasWrapper>
    </Container>
  );
};

export default DrawingCanvas;
