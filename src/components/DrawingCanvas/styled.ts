import styled from "styled-components";
export const ToolbarWrapper = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  cursor: move;
  z-index: 10;

  /* 툴바 컬럼 */
  .sc-dTvVRJ.fwolXF {
    display: flex;
    flex-direction: column;
    align-items: normal;
    width: 55px;
  }

  label {
    text-align: center;
  }
`;

export const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
`;

export const CanvasWrapper = styled.div`
  border: 1px solid #ccc;
  margin-top: 10px;
`;
