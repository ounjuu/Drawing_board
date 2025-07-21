import { useRef } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import { useCanvas } from "./hooks/useCanvas";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
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
  } = useCanvas(canvasRef);

  return (
    <div>
      <Toolbar
        tool={tool}
        strokeColor={strokeColor}
        fillColor={fillColor}
        lineWidth={lineWidth}
        setTool={setTool}
        setStrokeColor={setStrokeColor}
        setFillColor={setFillColor}
        setLineWidth={setLineWidth}
        saveToImage={saveToImage}
      />
      <Canvas
        canvasRef={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      />
    </div>
  );
}
