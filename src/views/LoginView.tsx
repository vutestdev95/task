import { FunctionComponent, memo, useCallback, useMemo, useState } from "react";
import { Fill } from "react-spaces";
import styled from "@emotion/styled";
import {
  Button,
  Card,
  Checkbox,
  Elevation,
  FormGroup,
  H2,
  H5,
  InputGroup,
} from "@blueprintjs/core";
import {
  useGetCustomerInfoQuery,
  useLoginMutation,
} from "../generated/graphql";
import { Link } from "react-router-dom";
import { Tooltip2 } from "@blueprintjs/popover2";
import { AppToaster } from "../utils/toaster";
import { WEBSITE } from "../config";
import { useAuth } from "../components/AuthProvider";
import GetCustomerInfoOutput from "../services/mockdata/json/GetCustomerInfoOutput.json";
import { bps, Constants } from "../components/common/Constants";
import { Controller, useForm } from "react-hook-form";

const { ROUTES } = Constants;

const Container = styled(Fill)`
  background-color: #f4f5f7;
  @media (max-width: ${bps["sm"]}px) {
    padding: 0;
  }
  margin-top: 0;
  overflow: auto;
`;

const CardForm = styled(Card)`
  width: 30%;
  margin: 40px auto;
  background-color: white;
  border-radius: 4px;
  padding: 40px;
  @media (max-width: ${bps["mac"]}px) {
    width: 40%;
  }
  @media (max-width: ${bps["xl"]}px) {
    width: 50%;
  }
  @media (max-width: ${bps["lg"]}px) {
    width: 60%;
  }
  @media (max-width: ${bps["md"]}px) {
    width: 70%;
  }
  @media (max-width: ${bps["sm"]}px) {
    width: 100%;
    height: 100%;
    box-shadow: none;
    margin: 0 auto;
    padding-top: 24px;
    .dont-have-account {
      display: block !important;
    }
  }
  @media (max-width: ${bps["xs"]}px) {
    padding: 24px 16px 0;
  }
`;

const CardHeader = styled.div`
  text-align: center;
  p {
    font-size: 16px;
  }
`;

const Form = styled.form`
  font-size: 16px;
  padding-top: 20px;
  .bp4-form-group label.bp4-label {
    margin-bottom: 8px;
  }
`;

const LoginFormInfomationSection = styled.div`
  display: flex;
  justify-content: space-between;

  label {
    display: flex;
    align-items: center;
  }

  .forgot-password {
    @media (max-width: ${bps["sm"]}px) {
      display: none;
    }
  }

  .remember-me {
    p {
      font-family: BasierCircle;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.25;
      letter-spacing: normal;
      text-align: justify;
      color: #102a47;
      margin-bottom: 4px;
    }
    margin-bottom: 0;
  }
`;

const SubmitInput = styled.div`
  display: flex;
  justify-content: end;
  padding-top: 20px;
  flex-direction: column;
  align-items: end;

  @media (max-width: ${bps["sm"]}px) {
    align-items: center;
  }

  .bp4-button {
    padding: 8px 24px;
  }
  .forgot-password {
    display: none;
    margin-top: 16px;
    text-align: center;
    @media (max-width: ${bps["sm"]}px) {
      display: block;
      margin-top: 22px;
    }
  }

  > .bp4-disabled {
    border-radius: 6px;
    background-color: #cbd0df !important;
  }
`;

const NavLink = styled(Link)`
  color: #406aff;
  :hover {
    color: #406aff;
  }
`;

const NavText = styled(H5)`
  color: #406aff;
  font-size: 16px;
  margin-bottom: 0;
  display: initial;

  :hover {
    color: #406aff;
  }
`;

const LoginButton = styled(Button)`
  width: 94px;
  @media (max-width: ${bps["sm"]}px) {
    width: 100%;
  }
`;

const FormItem = styled(FormGroup)`
  label {
    font-family: BasierCircle;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: justify;
    color: #394048;
    margin-bottom: 4px !important;
  }

  input {
    min-height: 40px;
  }

  .bp4-input-action {
    min-height: 40px;
  }

  span.bp4-popover2-target {
    min-height: 40px;
    display: flex;
    margin-right: 7px;
  }
`;

const LoginView: FunctionComponent = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [login, { loading }] = useLoginMutation();
  const { refetch: fetchCustomerInfor, loading: loadingCustomer } =
    useGetCustomerInfoQuery({
      skip: true,
    });
  const { setState } = useAuth();

  const {
    control,
    getValues,
    formState: { isValid },
  } = useForm();

  const getCustomer = useCallback(() => {
    if (localStorage.getItem("UserGUID")) {
      fetchCustomerInfor()
        .then((res) => {
          const user = res.data?.GetCustomerInfo;
          if (!user) throw new Error();
          setState({
            user: user as any,
            isInitialLoading: false,
          });
        })
        .catch(() => {
          const user = GetCustomerInfoOutput;
          setState({
            user: user as any,
            isInitialLoading: false,
          });
        });
    } else {
      setState({
        isInitialLoading: false,
      });
    }
  }, [fetchCustomerInfor, setState]);

  const loginForm = useCallback(
    (e: any) => {
      e.preventDefault();
      const values = getValues();
      const { username, password } = values;
      const navigateLoginSuccess = (loginRespone: any) => {
        localStorage.setItem("UserGUID", loginRespone.UserGUID);
        getCustomer();
      };
      login({
        variables: {
          input: {
            username,
            password,
            website: WEBSITE,
            loginmode: "webremote",
          },
        },
      })
        .then((res) => {
          const loginRespone = res.data?.login;
          if (loginRespone?.status === "0" && loginRespone.UserGUID) {
            navigateLoginSuccess(loginRespone);
          } else throw new Error(loginRespone?.statusdescription || "");
        })
        .catch((err) => {
          AppToaster.show({
            message: err.message,
          });
        });
    },
    [login, getCustomer, getValues]
  );

  const toggleShowPassword = useCallback(() => {
    setShowPassword((showPassword: boolean) => !showPassword);
  }, [setShowPassword]);

  const lockButton = useMemo(
    () => (
      <Tooltip2
        content={`${showPassword ? "Hide" : "Show"} Password`}
        disabled={loading}
      >
        <Button
          disabled={loading}
          icon={showPassword ? "eye-off" : "eye-open"}
          minimal={true}
          onClick={toggleShowPassword}
          data-testid="toogle-show-password"
        />
      </Tooltip2>
    ),
    [showPassword, loading, toggleShowPassword]
  );

  const inputUsername = useCallback(
    ({ field: { onBlur, onChange, value, ref } }) => (
      <InputGroup
        value={value}
        inputRef={ref}
        onChange={onChange}
        onBlur={onBlur}
        id="text-input-username"
        required
        placeholder="e.g john@example.com"
        readOnly={loading}
        data-testid="text-input-username"
      />
    ),
    [loading]
  );

  const inputPassword = useCallback(
    ({ field: { onBlur, onChange, value, ref } }) => (
      <InputGroup
        value={value}
        inputRef={ref}
        onChange={onChange}
        onBlur={onBlur}
        id="text-input-password"
        type={showPassword ? "text" : "password"}
        rightElement={lockButton}
        required
        placeholder="Type your password"
        readOnly={loading}
        data-testid="text-input-password"
      />
    ),
    [loading, lockButton, showPassword]
  );

  return (
    <Container>
      <CardForm elevation={Elevation.TWO}>
        <CardHeader>
          <H2>Log in</H2>
          <div data-testid="login-view">
            <p className="dont-have-account" style={{ display: "inline" }}>
              Don't have an account?
            </p>{" "}
            <NavLink to="">
              <NavText>Continue as guest</NavText>
            </NavLink>
          </div>
        </CardHeader>
        <Form onSubmit={loginForm}>
          <FormItem label="User Name" labelFor="text-input-username">
            <Controller
              name="username"
              rules={{ required: true }}
              control={control}
              defaultValue=""
              render={inputUsername}
            />
          </FormItem>
          <FormItem label="Password" labelFor="text-input-password">
            <Controller
              name="password"
              rules={{ required: true }}
              control={control}
              defaultValue=""
              render={inputPassword}
            />
          </FormItem>
          <LoginFormInfomationSection>
            <Checkbox className="remember-me" large>
              <p>Remember me</p>
            </Checkbox>
            <NavText>
              <NavLink className="forgot-password" to={ROUTES.forgotPassword}>
                Forgot your password?
              </NavLink>
            </NavText>
          </LoginFormInfomationSection>
          <SubmitInput>
            <LoginButton
              type="submit"
              className="bp4-intent-primary bp4-large"
              loading={loading || loadingCustomer}
              data-testid="input-login"
              disabled={!isValid}
            >
              Log in
            </LoginButton>
            <NavText>
              <NavLink className="forgot-password" to={ROUTES.forgotPassword}>
                Forgot your password?
              </NavLink>
            </NavText>
          </SubmitInput>
        </Form>
      </CardForm>
    </Container>
  );
};

export default memo(LoginView);
