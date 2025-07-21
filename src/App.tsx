// App.tsx
import { useEffect, useState } from "react";
import Header from "./components/Header";
import DrawingCanvas from "./components/DrawingCanvas";
import styled from "styled-components";

const AppContainer = styled.div`
  padding-top: 60px; /* 헤더 높이만큼 여백 */
`;

const MobileBlockMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 20px;
  font-weight: bold;
  color: #555;
`;

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); // 초기 실행
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <MobileBlockMessage>
        ❌ 모바일 버전은 지원하지 않습니다.
      </MobileBlockMessage>
    );
  }

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
