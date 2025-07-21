// Header/styled.js
import styled from "styled-components";

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  background: linear-gradient(to right, #2196f3, #9c27b0);
  color: white;
  display: flex;
  align-items: center;
  padding: 5px 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-weight: bold;
  font-size: 13px;
`;
