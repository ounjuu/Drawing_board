// styled.ts
import styled from "styled-components";

export const ToolbarContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const Button = styled.button<{ selected?: boolean }>`
  background-color: ${(props) => (props.selected ? "#007bff" : "#eee")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
`;
