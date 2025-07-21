import { useEffect, useRef, useState } from "react";
// konva 사용
import { Stage, Layer, Line, Rect, Circle } from "react-konva";
import { Container, ToolbarWrapper, CanvasWrapper } from "./styled";

// 드래그 라이브러리
import Draggable from "react-draggable";

// 툴바
import Toolbar from "../Toolbar";
// 함수
import { useCanvas } from "../../hooks/useCanvas";

const UNDO_KEY = "drawingAppUndoStack";
const REDO_KEY = "drawingAppRedoStack";
const STORAGE_KEY = "drawingAppShapes";
const TOOLBAR_POS_KEY = "drawingAppToolbarPos";

type Pos = { x: number; y: number };

const DrawingCanvas = () => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const {
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
    stageRef,
    undoStack,
    redoStack,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleUndo,
    handleRedo,
    handleClearAll,
  } = useCanvas();

  // 그리기 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shapes));
    } catch (e) {
      console.error("Failed to save shapes", e);
    }
  }, [shapes]);

  // undo redo 저장
  useEffect(() => {
    try {
      localStorage.setItem(UNDO_KEY, JSON.stringify(undoStack));
    } catch (e) {
      console.error("Failed to save undo stack", e);
    }
  }, [undoStack]);

  useEffect(() => {
    try {
      localStorage.setItem(REDO_KEY, JSON.stringify(redoStack));
    } catch (e) {
      console.error("Failed to save redo stack", e);
    }
  }, [redoStack]);

  // ✅ 로컬스토리지 저장
  const [toolbarPos, setToolbarPos] = useState<Pos>(() => {
    const saved = localStorage.getItem("drawingAppToolbarPos");
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });

  useEffect(() => {
    try {
      localStorage.setItem(TOOLBAR_POS_KEY, JSON.stringify(toolbarPos));
    } catch (e) {
      console.error("Failed to save toolbar position", e);
    }
  }, [toolbarPos]);

  return (
    <Container>
      <Draggable
        nodeRef={nodeRef}
        position={toolbarPos}
        onStop={(_, data) => {
          setToolbarPos({ x: data.x, y: data.y });
        }}
      >
        <ToolbarWrapper ref={nodeRef}>
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
            onClearAll={handleClearAll}
          />
        </ToolbarWrapper>
      </Draggable>

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
