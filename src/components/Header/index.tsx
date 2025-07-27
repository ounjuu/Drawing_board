// Header/Header.jsx
import React from "react";
import { HeaderContainer } from "./styled";

const Header = React.memo(() => {
  return (
    <HeaderContainer>
      <h1>Drawing</h1>
    </HeaderContainer>
  );
});
export default Header;
