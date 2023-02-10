import styled from "@emotion/styled";
import { FunctionComponent, useMemo } from "react";
import { useApp } from "../../ApplicationProvider";
import { breakpointToggleSidebar } from "../../components/common/Constants";
import { routes } from "../../utils/router";
import MenuItem from "./MenuItem";

const SideBar: FunctionComponent = () => {
  const appConfig = useApp().config;

  const menus = useMemo(() => {
    const exclude = appConfig.Navbar?.Exclude || [];
    return routes.filter((item) => !exclude.includes(item.key));
  }, [appConfig.Navbar?.Exclude]);

  return (
    <Container data-testid="sidebar">
      {menus.map(({ icon, title, path }) => (
        <MenuItem icon={icon} text={title} path={path} key={path} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  min-height: 400px;
  width: 100%;
  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    height: calc(100vh - 180px);
  }
`;
export default SideBar;
