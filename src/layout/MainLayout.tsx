import { Divider } from "@blueprintjs/core";
import styled from "@emotion/styled";
import { useMemo } from "react";
import { useApp } from "../ApplicationProvider";
import { breakpointToggleSidebar } from "../components/common/Constants";
import CopyRight from "./components/CopyRight";
import LogoContainer from "./components/Logo";
import NavBarMobile from "./components/NavBarMobile";
import SettingContainer from "./components/SettingContainer";
import SideBar from "./components/SideBar";

const MainLayout = ({ children, id = "" }: any) => {
  const appConfig = useApp().config;
  const background = useMemo(() => {
    const background = appConfig.Navbar?.Style?.Background || "#fff";
    return background;
  }, [appConfig.Navbar?.Style?.Background]);
  return (
    <WrapperLayout data-testid="main-layout" id={id}>
      <Wrap data-color={background}>
        <SideBarContainer data-color={background}>
          <LogoContainer />
          <SideBar />
        </SideBarContainer>
        <SettingContainer />
        <Divider />
        <CopyRight />
      </Wrap>
      <WrapperMobile>
        <NavBarMobile />
      </WrapperMobile>

      <Content>{children}</Content>
    </WrapperLayout>
  );
};

const WrapperLayout = styled.div`
  position: relative;
  background: #f4f5f7;
  height: 100vh;
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    flex-direction: column;
  }
`;

const SideBarContainer = styled.div`
  width: 238px;
  background: ${(props: any) => props["data-color"] || "#fff"};
  padding: 16px;
  flex: 1;
  z-index: 9999;
`;
const Wrap = styled.div`
  background: ${(props: any) => props["data-color"] || "#fff"};
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    display: none;
  }

  box-shadow: 2px 0px 1px rgba(44, 58, 110, 0.06);
`;
const Content = styled.div`
  padding: 0px;
  flex: 1;
  overflow-y: auto;
`;

const WrapperMobile = styled.div`
  @media only screen and (min-width: ${breakpointToggleSidebar}px) {
    display: none;
  }
`;
export default MainLayout;
