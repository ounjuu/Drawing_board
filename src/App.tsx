// App.tsx
import Header from "./components/Header";
import DrawingCanvas from "./components/DrawingCanvas";
import styled from "styled-components";

const AppContainer = styled.div`
  padding-top: 60px; /* 헤더 높이만큼 여백 */
`;

const App = () => {
  return (
    <div>
      {/* 헤더 */}
      <Header />

      {/* 캔버스 */}
      <AppContainer>
        <DrawingCanvas />
      </AppContainer>
    </div>
  );
};

export default App;
