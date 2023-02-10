import { Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import styled from "@emotion/styled";
import { useCallback, useMemo } from "react";
import { useApp } from "../../ApplicationProvider";
import { useAuth } from "../../components/AuthProvider";
import { breakpointToggleSidebar } from "../../components/common/Constants";
import { useLogout } from "../../hooks/useLogout";
import { SVGGear } from "../../svgs/SVGGear";
import { DEFAULT_COLOR } from "../../utils/variable";
import { VerticalSpacer } from "../../views/PlaceOrderView";

interface ISettingContainer {
  data?: TInfo;
}
type TInfo = {
  name: string;
  logo: string;
  nameCompany: string;
};

const SettingContainer = ({ data }: ISettingContainer) => {
  const DEFAULT_IMAGE = "images/avatar.svg";
  const logout = useLogout();

  const appConfig = useApp().config;
  const { user } = useAuth()?.state;

  const color = useMemo(() => {
    const color = appConfig.Navbar?.Style?.Color || DEFAULT_COLOR;
    return color;
  }, [appConfig.Navbar?.Style]);

  const settingColor = useMemo(() => {
    const colorText = appConfig.Navbar?.Style?.Color || DEFAULT_COLOR;
    const color = appConfig.Navbar?.Style?.IconColor || colorText;
    return color;
  }, [appConfig.Navbar?.Style]);

  const errorLogo = useCallback(({ currentTarget }) => {
    currentTarget.onerror = null;
    currentTarget.src = DEFAULT_IMAGE;
  }, []);

  return (
    <Container
      data-setting-color={settingColor}
      data-testid="setting_container"
    >
      <Image
        src={data?.logo || DEFAULT_IMAGE}
        alt="[avatar]"
        onError={errorLogo}
      />
      <div
        style={{
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        <LabelName data-color={color}>{user?.Caller}</LabelName>
        <VerticalSpacer height={4} />
        <LabelCompany data-color={color}>{user?.Service}</LabelCompany>
      </div>

      <Popover2
        enforceFocus={false}
        isOpen={undefined}
        content={
          <Menu key="menu">
            <MenuItem onClick={logout} icon="log-out" text="Log out" label="" />
          </Menu>
        }
      >
        <SVGGear fill={settingColor || "#8DA4BE"} />
      </Popover2>
    </Container>
  );
};

const Container = styled.div`
  width: 222px;
  height: 56px;
  background: transparent;
  border-radius: 6px;
  padding: 8px;
  margin: 8px 8px 7px 8px;
  display: grid;
  grid-template-columns: 40px 1fr 32px;
  align-items: center;

  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    box-shadow: 0px 2px 1px rgba(44, 58, 110, 0.04);
    border-radius: 6px;
    border: 1px solid ${(props: any) => props["data-setting-color"]};
  }
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
`;

const LabelName = styled.p`
  color: ${(props: any) => props["data-color"]};
  font-size: 15px;
  line-height: 18px;
`;

const LabelCompany = styled.p`
  color: ${(props: any) => props["data-color"]};
  font-size: 15px;
  line-height: 18px;
  opacity: 0.8;
`;

export default SettingContainer;
