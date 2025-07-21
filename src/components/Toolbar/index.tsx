import React from "react";

interface Props {
  tool: string;
  strokeColor: string;
  fillColor: string;
  lineWidth: number;
  setTool: (tool: any) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  saveToImage: () => void;
}

const Toolbar: React.FC<Props> = ({
  tool,
  strokeColor,
  fillColor,
  lineWidth,
  setTool,
  setStrokeColor,
  setFillColor,
  setLineWidth,
  saveToImage,
}) => {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <label>
        Tool:
        <select value={tool} onChange={(e) => setTool(e.target.value as any)}>
          <option value="line">Line</option>
          <option value="rect">Rectangle</option>
          <option value="circle">Circle</option>
        </select>
      </label>

      <label>
        Stroke:
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
        />
      </label>

      <label>
        Fill:
        <input
          type="color"
          value={fillColor}
          onChange={(e) => setFillColor(e.target.value)}
        />
      </label>

      <label>
        Width:
        <input
          type="range"
          min={1}
          max={20}
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
        />
      </label>

      <button onClick={saveToImage}>💾 저장</button>
    </div>
  );
};

export default Toolbar;
