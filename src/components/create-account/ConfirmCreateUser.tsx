import { Button, Card, Elevation, H2, H5 } from "@blueprintjs/core";
import styled from "@emotion/styled";
import { Fill } from "react-spaces";
import SVGConfirmEmail from "../../svgs/SVGConfirmEmail";
import { bps } from "../common/Constants";

export const ConfirmCreateUser = () => {
  return (
    <Container>
      <CardForm elevation={Elevation.TWO} data-testid="confirm-create-user">
        <SVGConfirmEmail />
        <Title>Welcome to Labcorp, John!</Title>
        <SubTitle>
          We just sent you a confirmation to john@ctt.com <br />
          Please click the link in order to confirm your account.
        </SubTitle>
        <Submit data-testid="confirm-create-submit">Go to my Dashboard</Submit>
        <LinkText>Resend confirmation e-mail</LinkText>
      </CardForm>
    </Container>
  );
};

const Submit = styled(Button)`
  height: 40px;
  border-radius: 6px;
  color: #ffffff !important;
  background: #102a47 !important;
  box-shadow: 0px 2px 1px rgba(44, 58, 110, 0.12) !important;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  padding: 10px 24px;
  margin: 32px 0 22px;
`;

const LinkText = styled(H5)`
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

const Title = styled(H2)`
  font-size: 30px;
  margin-top: 24px;
  text-align: center;
`;

const SubTitle = styled.div`
  text-align: left;
  font-size: 15px;
  font-weight: normal;
  text-align: center;
`;

const CardForm = styled(Card)`
  margin: 40px auto;
  background-color: white;
  border-radius: 4px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30%;
  @media (min-width: ${bps["xxl"]}px) {
    width: 24%;
  }
  @media (max-width: ${bps["mac"]}px) {
    width: 30%;
  }
  @media (max-width: ${bps["xl"]}px) {
    width: 38%;
  }
  @media (max-width: ${bps["lg"]}px) {
    width: 45%;
  }
  @media (max-width: ${bps["md"]}px) {
    width: 60%;
  }
  @media (max-width: ${bps["sm"]}px) {
    width: 100%;
    box-shadow: none;
  }
`;

const Container = styled(Fill)`
  @media (min-width: ${bps["sm"]}px) {
    background-color: #f4f5f7;
  }
  overflow-y: scroll;
`;
