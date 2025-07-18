import React, { useEffect } from "react";
import type { RefObject } from "react";
import { StyledCanvasWrapper, StyledCanvas } from "./styled";

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  startDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
  draw: (e: React.MouseEvent | React.TouchEvent) => void;
  stopDrawing: () => void;
  initCanvas: () => void;
  restoreCanvasFromLocalStorage: () => void;
}

const Canvas: React.FC<Props> = ({
  canvasRef,
  startDrawing,
  draw,
  stopDrawing,
  initCanvas,
  restoreCanvasFromLocalStorage,
}) => {
  useEffect(() => {
    initCanvas();
    restoreCanvasFromLocalStorage();
  }, [initCanvas, restoreCanvasFromLocalStorage]);

  return (
    <StyledCanvasWrapper>
      <StyledCanvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </StyledCanvasWrapper>
  );
};

export default Canvas;
