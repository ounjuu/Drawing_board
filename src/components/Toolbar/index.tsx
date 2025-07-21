import { ToolbarContainer, Button } from "./styled"; // 상대 경로 확인
import { IoArrowRedo, IoArrowUndo } from "react-icons/io5";

type Props = {
  tool: "pencil" | "rect" | "circle";
  setTool: (tool: "pencil" | "rect" | "circle") => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  fillColor: string;
  setFillColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const Toolbar = ({
  tool,
  setTool,
  strokeColor,
  setStrokeColor,
  fillColor,
  setFillColor,
  strokeWidth,
  setStrokeWidth,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: Props) => {
  return (
    <ToolbarContainer>
      <Button selected={tool === "pencil"} onClick={() => setTool("pencil")}>
        연필
      </Button>
      <Button selected={tool === "rect"} onClick={() => setTool("rect")}>
        사각형
      </Button>
      <Button selected={tool === "circle"} onClick={() => setTool("circle")}>
        원
      </Button>

      <label>
        선 색상:
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
          style={{ marginLeft: 4 }}
        />
      </label>

      <label>
        채우기 색상:
        <input
          type="color"
          value={fillColor}
          onChange={(e) => setFillColor(e.target.value)}
          style={{ marginLeft: 4 }}
        />
      </label>

      <label>
        선 굵기:
        <input
          type="range"
          min={1}
          max={20}
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          style={{ marginLeft: 4 }}
        />
      </label>

      <Button onClick={onUndo} disabled={!canUndo}>
        <IoArrowUndo />
      </Button>
      <Button onClick={onRedo} disabled={!canRedo}>
        <IoArrowRedo />
      </Button>
    </ToolbarContainer>
  );
};

export default Toolbar;
