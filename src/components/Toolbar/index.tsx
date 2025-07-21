import { useCallback, useState, useEffect } from "react";
import { ToolbarContainer, Button } from "./styled";
import { IoArrowRedo, IoArrowUndo } from "react-icons/io5";
import { IoIosColorPalette } from "react-icons/io";
import { IoColorFill } from "react-icons/io5";
// 연필
import { FaPen } from "react-icons/fa";
// 사각형
import { FaRegSquare } from "react-icons/fa";
// 원
import { FaRegCircle } from "react-icons/fa";
// 라인 굵기
import { MdLineWeight } from "react-icons/md";
// 지우개
import { FaEraser } from "react-icons/fa";

type Props = {
  tool: "pencil" | "rect" | "circle" | "fill";
  setTool: (tool: "pencil" | "rect" | "circle" | "fill") => void;
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
  onClearAll: () => void;
};

const TOOLBAR_STORAGE_KEY = "drawingAppToolbarSettings";

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
  onClearAll,
}: Props) => {
  // 상태 변경할 때 localStorage에 저장하는 함수
  const saveSettingsToStorage = useCallback(
    (
      newSettings: Partial<{
        tool: "pencil" | "rect" | "circle" | "fill";
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
      }>
    ) => {
      try {
        const prev = localStorage.getItem(TOOLBAR_STORAGE_KEY);
        const prevSettings = prev ? JSON.parse(prev) : {};
        const updated = { ...prevSettings, ...newSettings };
        localStorage.setItem(TOOLBAR_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save toolbar settings", e);
      }
    },
    []
  );

  // 래핑해서 상태 변경 + 저장
  const handleSetTool = (newTool: "pencil" | "rect" | "circle" | "fill") => {
    setTool(newTool);
    saveSettingsToStorage({ tool: newTool });
  };
  const handleSetStrokeColor = (color: string) => {
    setStrokeColor(color);
    saveSettingsToStorage({ strokeColor: color });
  };
  const handleSetFillColor = (color: string) => {
    setFillColor(color);
    saveSettingsToStorage({ fillColor: color });
  };
  const handleSetStrokeWidth = (width: number) => {
    setStrokeWidth(width);
    saveSettingsToStorage({ strokeWidth: width });
  };

  // 선 굵기 옵션
  const [showStrokeWidthOptions, setShowStrokeWidthOptions] = useState(false);
  const strokeWidthOptions = [2, 5, 10];

  const handleSelectStrokeWidth = (width: number) => {
    handleSetStrokeWidth(width);
    setShowStrokeWidthOptions(false); // 선택하면 메뉴 닫기
  };

  return (
    <ToolbarContainer>
      {/* 자유 그리기, 도형 선택 */}
      <Button
        selected={tool === "pencil"}
        onClick={() => handleSetTool("pencil")}
      >
        <FaPen />
      </Button>
      <Button selected={tool === "rect"} onClick={() => handleSetTool("rect")}>
        <FaRegSquare />
      </Button>
      <Button
        selected={tool === "circle"}
        onClick={() => handleSetTool("circle")}
      >
        <FaRegCircle />
      </Button>
      <Button selected={tool === "fill"} onClick={() => handleSetTool("fill")}>
        <IoColorFill />
      </Button>

      {/* 선 색깔 */}
      <label>
        <IoIosColorPalette />
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => handleSetStrokeColor(e.target.value)}
          style={{ padding: "0px 12px" }}
        />
      </label>

      {/* 채우기 */}
      <label>
        <IoColorFill />
        <input
          type="color"
          value={fillColor}
          onChange={(e) => handleSetFillColor(e.target.value)}
          style={{ padding: "0px 12px" }}
        />
      </label>

      {/* 선 굵기 */}
      {/* 선 굵기 아이콘 클릭 시 토글 */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <Button
          onClick={() => setShowStrokeWidthOptions((v) => !v)}
          style={{ width: "100%" }}
        >
          <MdLineWeight />
        </Button>

        {/* 토글 상태에 따른 3단계 굵기 버튼 */}
        {showStrokeWidthOptions && (
          <div
            style={{
              position: "absolute",
              top: "120%",
              left: 0,
              background: "white",
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: 8,
              display: "flex",
              gap: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 1000,
            }}
          >
            {strokeWidthOptions.map((width) => (
              <button
                key={width}
                onClick={() => handleSelectStrokeWidth(width)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: strokeWidth === width ? "#007bff" : "#eee",
                  color: strokeWidth === width ? "white" : "black",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  minWidth: 40,
                  userSelect: "none",
                }}
                aria-pressed={strokeWidth === width}
              >
                {width}px
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 이전 undo*/}
      <Button onClick={onUndo} disabled={!canUndo}>
        <IoArrowUndo />
      </Button>

      {/* 앞으로 redo*/}
      <Button onClick={onRedo} disabled={!canRedo}>
        <IoArrowRedo />
      </Button>

      {/* 전체 지우개 */}
      <Button onClick={onClearAll}>
        <FaEraser />
      </Button>
    </ToolbarContainer>
  );
};

export default Toolbar;
