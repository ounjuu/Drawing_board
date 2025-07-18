import { useRef } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import { useCanvas } from "./hooks/useCanvas";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    saveToImage,
    initCanvas,
    restoreCanvasFromLocalStorage,
  } = useCanvas(canvasRef);

  return (
    <>
      <Toolbar onUndo={undo} onRedo={redo} onSave={saveToImage} />
      <Canvas
        canvasRef={canvasRef}
        startDrawing={startDrawing}
        draw={draw}
        stopDrawing={stopDrawing}
        initCanvas={initCanvas}
        restoreCanvasFromLocalStorage={restoreCanvasFromLocalStorage}
      />
    </>
  );
}

export default App;
