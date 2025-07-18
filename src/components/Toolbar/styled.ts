import styled from "styled-components";

const ToolbarContainer = styled.div.attrs(() => ({
  draggable: true,
}))`
  position: absolute;
  top: 10px;
  left: 10px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  cursor: grab;
  z-index: 10;
`;

export default ToolbarContainer;
