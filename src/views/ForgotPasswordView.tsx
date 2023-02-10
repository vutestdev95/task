import { Button, Card, Elevation, H5 } from "@blueprintjs/core";
import styled from "@emotion/styled";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Fill } from "react-spaces";
import { bps, Constants } from "../components/common/Constants";
import { FormItem } from "../components/create-account/FormItem";
import { FormForgotPassword } from "../components/forgot-password/formForgotPassword";
import { isEmail } from "../utils/validations";

const { ROUTES } = Constants;

const Container = styled(Fill)`
  background-color: #f4f5f7;
  @media (max-width: ${bps["sm"]}px) {
    padding: 0;
  }
  @media (max-width: ${bps["sm"]}px) {
    background-color: #fff;
  }
  margin-top: 0;
  overflow: auto;
`;

const CardForm = styled(Card)`
  width: 30%;
  margin: 40px auto;
  background-color: #fff;
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
    width: 90%;
    height: 100%;
    box-shadow: none;
    margin: 0 auto;
    padding-top: 24px;
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

const NavText = styled(H5)`
  z-index: 10;
  color: #406aff;
  font-size: 16px;
  margin-bottom: 0;

  :hover {
    color: #406aff;
  }
`;

const SubmitInput = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  flex-direction: row;
  align-items: center;

  @media (max-width: ${bps["sm"]}px) {
    flex-direction: column-reverse;
  }

  > .bp4-disabled {
    border-radius: 6px;
    background-color: #cbd0df !important;
    color: #fff;
    font-weight: 500;
    font-size: 16px;
  }
`;

const NavLink = styled(Link)`
  color: #406aff;
  :hover {
    color: #406aff;
  }
`;

const Subtitle = styled.p`
  margin-bottom: 24px;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  margin: 0 30px 8px 30px;
`;

const RetrieveButton = styled(Button)`
  width: 190px;
  background-color: #cbd0df;
  color: white;
  @media (max-width: ${bps["sm"]}px) {
    width: 100%;
    margin-bottom: 24px;
  }
  .bp4-button.bp4-intent-primary.bp4-disabled {
    color: #fff;
    background-color: #cbd0df !important;
  }
  > .bp4-disabled {
    border-radius: 6px;
    color: #fff;
    background-color: #cbd0df !important;
  }
`;

export const ForgotPasswordView = () => {
  const [errorEmail, setErrorEmail] = useState("");
  const {
    control,
    formState: { isValid },
    getValues,
  } = useForm();

  const submitForm = useCallback(() => {
    const { Email } = getValues();
    if (!isEmail(Email)) {
      setErrorEmail("Invalid e-mail format");
      return;
    }
    setErrorEmail("");
  }, [getValues]);

  return (
    <Container>
      <CardForm elevation={Elevation.TWO} data-testid="forgot-password-view">
        <CardHeader>
          <Title>Forgot your password?</Title>
          <div>
            <Subtitle>
              Insert the username and email address associated with your
              account. You will receive your password via email.
            </Subtitle>
          </div>
        </CardHeader>
        <FormItem
          errorEmail={errorEmail}
          formData={control}
          formFields={FormForgotPassword as any}
        />

        <SubmitInput>
          <NavLink to={ROUTES.login}>
            <NavText className="forgot-password">Return to log in</NavText>
          </NavLink>
          <RetrieveButton
            disabled={!isValid}
            onClick={submitForm}
            className="bp4-intent-primary bp4-large"
            data-testid="forgot-password-submit"
          >
            Retrieve password
          </RetrieveButton>
        </SubmitInput>
      </CardForm>
    </Container>
  );
};
