import React, { useRef, useEffect } from "react";

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
}

const Canvas: React.FC<Props> = ({
  canvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 모바일 대응 확대
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 100;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid gray", touchAction: "none" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  );
};

export default Canvas;
