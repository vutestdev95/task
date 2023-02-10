import { Alignment, H5, Navbar } from "@blueprintjs/core";
import styled from "@emotion/styled";
import { isEmpty } from "lodash";
import { FunctionComponent, useEffect, useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { CenterType, Fill, Top } from "react-spaces";
import { useApp } from "../../ApplicationProvider";
import { useAuth } from "../AuthProvider";
import { bps, Constants } from "../common/Constants";

const { ROUTES } = Constants;

const Container = styled(Fill)`
  width: 100%;
`;

const Content = styled(Fill)``;

const NavbarCustom = styled(Navbar)`
  box-shadow: 0 2px 1px 0 rgba(44, 58, 110, 0.06);
`;

const NavbarLogo = styled(Navbar.Group)`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-left: -15px;
  .logo-mobile {
    display: none;
  }
  @media (max-width: ${bps["lg"]}px) {
    margin-left: -10px;
    justify-content: start;

    .logo {
      display: none;
    }
    .logo-mobile {
      display: block;
    }
  }
`;

const NavLink = styled(Link)`
  z-index: 10;
  color: #406aff;
  font-weight: 400;
  font-size: 16px;

  :hover {
    color: #406aff;
  }

  @media (min-width: ${bps["xs"]}px) {
    > .join-organization-mobile {
      display: none;
    }
    > .create-account-mobile {
      display: none;
    }
    > .register-account-mobile {
      display: none;
    }
  }

  @media (max-width: ${bps["xs"]}px) {
    > .join-organization {
      display: none;
    }
    > .create-account {
      display: none;
    }
    > .register-account {
      display: none;
    }
    > .join-organization-mobile {
      display: inline;
    }
    > .create-account-mobile {
      display: inline;
    }
    > .register-account-mobile {
      display: inline;
    }
  }
`;

const NavText = styled(H5)`
  z-index: 10;
  color: #406aff;
  font-size: 16px;
  margin-bottom: 0;

  :hover {
    color: #406aff;
  }
`;

const NavbarGroup = styled(Navbar.Group)`
  margin-right: 24px;
  @media (max-width: ${bps["lg"]}px) {
    margin-right: 0px;
  }
`;

interface Props {
  isHideMenu?: boolean;
  children: JSX.Element;
}

const PublicLayout: FunctionComponent<Props> = ({ children }) => {
  const state = useAuth()?.state;
  const appConfig = useApp().config;
  const history = useHistory();
  const { pathname } = useLocation();
  const isCreateAccountPage = pathname === ROUTES.createAccount;
  const isRegisterAccountPage = pathname === ROUTES.registerAccount;
  const isLoginPage = pathname === ROUTES.login;
  const logoUrl = useMemo(() => {
    return isEmpty(appConfig.Logo) ? "images/Logo.svg" : appConfig.Logo || "";
  }, [appConfig.Logo]);

  const logoUrlMobile = useMemo(() => {
    return isEmpty(appConfig.LogoMobile)
      ? "images/logo-mobile.svg"
      : appConfig.LogoMobile || "";
  }, [appConfig.LogoMobile]);

  useEffect(() => {
    if (!state?.isInitialLoading && state?.user)
      history.replace(Constants.DEFAULT_ROUTE);
  }, [state, history]);

  return (
    <Container>
      <Top size={52} centerContent={CenterType.Vertical}>
        <NavbarCustom>
          <NavbarLogo align={Alignment.LEFT}>
            <Link className="bp4-minimal" to="">
              <img className="logo" src={logoUrl} alt="logo" />
              <img
                className="logo-mobile"
                src={logoUrlMobile}
                alt="logo-mobile"
              />
            </Link>
          </NavbarLogo>
          <NavbarGroup align={Alignment.RIGHT}>
            <NavLink className="bp4-minimal" to="">
              <NavText className="join-organization">
                Join an organization
              </NavText>
              <NavText className="join-organization-mobile">Join</NavText>
            </NavLink>
            {!isCreateAccountPage && (
              <>
                <Navbar.Divider />
                <NavLink className="bp4-minimal" to={ROUTES.createAccount}>
                  <NavText className="create-account">
                    Create an account
                  </NavText>
                  <NavText className="create-account-mobile">
                    Create account
                  </NavText>
                </NavLink>
              </>
            )}
            {!isRegisterAccountPage && (
              <>
                <Navbar.Divider />
                <NavLink className="bp4-minimal" to={ROUTES.registerAccount}>
                  <NavText className="register-account">
                    Register an account
                  </NavText>
                  <NavText className="register-account-mobile">
                    Register account
                  </NavText>
                </NavLink>
              </>
            )}
            {!isLoginPage && (
              <>
                <Navbar.Divider />
                <NavLink className="bp4-minimal" to={ROUTES.login}>
                  <NavText>Log in</NavText>
                </NavLink>
              </>
            )}
          </NavbarGroup>
        </NavbarCustom>
      </Top>
      <Content>{children}</Content>
    </Container>
  );
};

export default PublicLayout;
