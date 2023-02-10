import { Button, Card, Elevation, H2, H5 } from "@blueprintjs/core";
import styled from "@emotion/styled";
import { omit } from "lodash";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Fill } from "react-spaces";
import { bps } from "../components/common/Constants";
import { ConfirmCreateUser } from "../components/create-account/ConfirmCreateUser";
import { FormRegisterUser } from "../components/create-account/formRegisterAccount";
import { FormItem } from "../components/create-account/FormItem";
import PublicLayout from "../components/layout/PublicLayout";
import {
  checkEmptyValueInObject,
  convertArrayToObjectKey,
} from "./CreateAccountView";

//Initial values
const initialRegisterUser = convertArrayToObjectKey(FormRegisterUser);

//Styles, can import from CreateAccoutView.tsx instead of re-define like below
const Container = styled(Fill)`
  @media (min-width: ${bps["md"]}px) {
    background-color: #f4f5f7;
  }
  overflow-y: scroll;
`;

const CardForm = styled(Card)`
  width: 35%;
  margin: 40px auto;
  background-color: white;
  border-radius: 4px;
  padding: 40px;
  @media (max-width: ${bps["xxl"]}px) {
    width: 40%;
  }
  @media (max-width: ${bps["mac"]}px) {
    width: 45%;
  }
  @media (max-width: ${bps["xl"]}px) {
    width: 60%;
  }
  @media (max-width: ${bps["lg"]}px) {
    width: 70%;
  }
  @media (max-width: ${bps["md"]}px) {
    width: 100%;
    box-shadow: none;
  }
`;

const Content = styled.div``;

const CardHeader = styled.div`
  text-align: center;
  p {
    font-size: 16px;
  }
`;

const Title = styled(H2)`
  font-size: 30px;
`;

const SubTitle = styled.div`
  text-align: left;
  font-size: 15px;
  font-weight: normal;
`;

const NavText = styled(H5)`
  color: #406aff;
  margin-bottom: 0;
  display: initial;
  font-weight: normal;
  h5.bp4-heading {
    font-size: 15px;
    font-weight: normal;
  }
  :hover {
    color: #406aff;
  }
`;

const SubmitInput = styled.div`
  display: flex;
  padding-top: 20px;
  justify-content: ${({ end = "true" }: { end: string }) =>
    end === "true" ? "end" : "space-between"};
  .bp4-button {
    padding: 8px 24px;
  }
`;

const RegisterView: FunctionComponent = () => {
  const [isConfirm, setIsConfirm] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

  //Form hook
  const {
    control: registerUser,
    watch,
    getValues: getValuesRegisterUser,
  } = useForm({
    defaultValues: initialRegisterUser,
  });

  const watchRegisterUser = useWatch({ control: registerUser });

  //Function
  useEffect(() => {
    const isFillAllRequiredFieldsRegisterUser = checkEmptyValueInObject(
      omit(watchRegisterUser, ["Phone", "Email", "MoreAddress"])
    );

    if (isFillAllRequiredFieldsRegisterUser !== isDisableButton) {
      setIsDisableButton(isFillAllRequiredFieldsRegisterUser);
    }
  }, [watchRegisterUser, isDisableButton]);

  const onSubmitHandle = useCallback(() => {
    const createUserValue = getValuesRegisterUser();
    console.log(createUserValue);

    if (watch("RepeatPassword") !== watch("Password")) {
      setErrorConfirmPassword("Password do not match");
    } else {
      setErrorConfirmPassword("");
      setIsConfirm(true); // Move to confirm page
    }
  }, [watch, getValuesRegisterUser]);

  return (
    <PublicLayout isHideMenu={isConfirm}>
      {isConfirm ? (
        <ConfirmCreateUser />
      ) : (
        <Container>
          <CardForm
            elevation={Elevation.TWO}
            data-testid="register-account-view"
          >
            <Content>
              <CardHeader>
                <Title className="mb-6" data-testid="register-account-title">
                  Register account
                </Title>
                <Content data-testid="register-account">
                  <FormItem
                    errorConfirmPassword={errorConfirmPassword}
                    formData={registerUser}
                    formFields={FormRegisterUser as any}
                  />
                  <SubTitle>
                    By registing an account, you agree to our
                    <NavText> Terms</NavText> &{" "}
                    <NavText>Privacy Policy.</NavText>
                  </SubTitle>
                </Content>
              </CardHeader>

              <SubmitInput end={"true"}>
                <Button
                  disabled={!isDisableButton}
                  onClick={onSubmitHandle}
                  className="align-self-end bp4-intent-primary bp4-large"
                  data-testid={"button-register-account"}
                >
                  Register account
                </Button>
              </SubmitInput>
            </Content>
          </CardForm>
        </Container>
      )}
    </PublicLayout>
  );
};

export default RegisterView;
