import React, { useCallback, useState, useEffect } from "react";
import { ToolbarContainer, Button } from "./styled";
import { IoArrowRedo, IoArrowUndo } from "react-icons/io5";

type Pos = { x: number; y: number };

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

const STORAGE_KEY = "drawingAppToolbarSettings";
const TOOLBAR_POS_KEY = "drawingAppToolbarPos";

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
  // 상태 변경할 때 localStorage에 저장하는 함수
  const saveSettingsToStorage = useCallback(
    (
      newSettings: Partial<{
        tool: "pencil" | "rect" | "circle";
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
      }>
    ) => {
      try {
        const prev = localStorage.getItem(STORAGE_KEY);
        const prevSettings = prev ? JSON.parse(prev) : {};
        const updated = { ...prevSettings, ...newSettings };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save toolbar settings", e);
      }
    },
    []
  );

  // 래핑해서 상태 변경 + 저장
  const handleSetTool = (newTool: "pencil" | "rect" | "circle") => {
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

  // 툴바 위치 저장
  const [toolbarPos, setToolbarPos] = useState<Pos>(() => {
    try {
      const saved = localStorage.getItem(TOOLBAR_POS_KEY);
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    } catch {
      return { x: 0, y: 0 };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TOOLBAR_POS_KEY, JSON.stringify(toolbarPos));
    } catch (e) {
      console.error("Failed to save toolbar position", e);
    }
  }, [toolbarPos]);

  return (
    <ToolbarContainer>
      <Button
        selected={tool === "pencil"}
        onClick={() => handleSetTool("pencil")}
      >
        연필
      </Button>
      <Button selected={tool === "rect"} onClick={() => handleSetTool("rect")}>
        사각형
      </Button>
      <Button
        selected={tool === "circle"}
        onClick={() => handleSetTool("circle")}
      >
        원
      </Button>

      <label>
        선 색상:
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => handleSetStrokeColor(e.target.value)}
          style={{ marginLeft: 4 }}
        />
      </label>

      <label>
        채우기 색상:
        <input
          type="color"
          value={fillColor}
          onChange={(e) => handleSetFillColor(e.target.value)}
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
          onChange={(e) => handleSetStrokeWidth(Number(e.target.value))}
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
