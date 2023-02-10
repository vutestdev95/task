import styled from "@emotion/styled";
import * as variable from "../../utils/variable";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../../ApplicationProvider";
import { memo, useMemo } from "react";

interface MenuItemProps {
  icon: any;
  text: string;
  path: string;
}
const MenuItem = ({ icon, text, path }: MenuItemProps) => {
  const location = useLocation();
  const appConfig = useApp().config;

  const variableApp = useMemo(() => {
    const ACTIVE_BG =
      appConfig.Navbar?.Style?.SecondaryColor || variable.ACTIVE_BG;
    const DEFAULT_BG =
      appConfig.Navbar?.Style?.Background || variable.DEFAULT_BG;
    const ACTIVE_COLOR =
      appConfig.Navbar?.Style?.PrimaryColor || variable.ACTIVE_COLOR;
    const DEFAULT_COLOR =
      appConfig.Navbar?.Style?.Color || variable.DEFAULT_COLOR;
    const ACTIVE_COLOR_ICON =
      appConfig.Navbar?.Style?.PrimaryColor || variable.ACTIVE_COLOR_ICON;
    const DEFAULT_COLOR_ICON =
      appConfig.Navbar?.Style?.IconColor || DEFAULT_COLOR;
    return {
      ACTIVE_BG,
      DEFAULT_BG,
      ACTIVE_COLOR_ICON,
      DEFAULT_COLOR_ICON,
      ACTIVE_COLOR,
      DEFAULT_COLOR,
    };
  }, [appConfig.Navbar?.Style]);

  const isActive = useMemo(
    () =>
      location.pathname === path ||
      (new RegExp(`^${path}`).test(location.pathname) && path !== "/"),
    [location.pathname, path]
  );

  const IconMenu = icon;

  return (
    <Link style={{ textDecoration: "none" }} to={path}>
      <MenuItemContainer
        isActive={isActive}
        ACTIVE_BG={variableApp.ACTIVE_BG}
        DEFAULT_BG={variableApp.DEFAULT_BG}
      >
        <Wrapper>
          {icon && (
            <IconMenu
              color={
                isActive
                  ? variableApp.ACTIVE_COLOR_ICON
                  : variableApp.DEFAULT_COLOR_ICON
              }
            />
          )}

          <TextOfMenuItem
            style={{
              color: isActive
                ? variableApp.ACTIVE_COLOR
                : variableApp.DEFAULT_COLOR,
            }}
          >
            {text}
          </TextOfMenuItem>
        </Wrapper>
      </MenuItemContainer>
    </Link>
  );
};

const MenuItemContainer = styled.div<{
  isActive: boolean;
  ACTIVE_BG: string;
  DEFAULT_BG: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 12px;
  gap: 10px;

  width: 206px;
  height: 40px;

  border-radius: 6px;
  margin-bottom: 4px;
  &:hover {
    background: ${(props) => props.ACTIVE_BG};
    border-radius: 6px;
    cursor: pointer;
  }

  background: ${(props) =>
    props.isActive ? props.ACTIVE_BG : props.DEFAULT_BG};
`;

const Wrapper = styled.li`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  gap: 10px;
  height: 40px;
  align-items: center;
`;

export default memo(MenuItem);

const TextOfMenuItem = styled.div`
  width: 150px;
  height: 20px;
  font-size: 16px;
  line-height: 20px;
  text-align: justify;
`;
