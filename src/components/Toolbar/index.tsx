import React from "react";
import ToolbarContainer from "./styled";

interface Props {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
}

const Toolbar = ({ onUndo, onRedo, onSave }: Props) => {
  return (
    <ToolbarContainer>
      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>
      <button onClick={onSave}>Save</button>
    </ToolbarContainer>
  );
};

export default Toolbar;
