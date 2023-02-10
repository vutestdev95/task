import {
  Button,
  Card,
  Checkbox,
  Elevation,
  H2,
  H5,
  Icon,
} from "@blueprintjs/core";

import { IconNames } from "@blueprintjs/icons";
import styled from "@emotion/styled";
import { omit } from "lodash";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Fill } from "react-spaces";
import { COLORS, bps } from "../components/common/Constants";
import cls from "../components/common/Select.module.css";
import { ConfirmCreateUser } from "../components/create-account/ConfirmCreateUser";
import { FormBillingAddress } from "../components/create-account/formBillingAddress";
import { FormCreateUser } from "../components/create-account/formCreateUser";
import { FormItem, IFormItem } from "../components/create-account/FormItem";
import { FormAddress } from "../components/create-account/formPickupAddress";
import PublicLayout from "../components/layout/PublicLayout";

export const convertArrayToObjectKey = (data: any) =>
  data.flat().reduce((acc: any, curr: IFormItem) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

export const checkEmptyValueInObject = (data: any) =>
  Object.values(data).every((value) =>
    typeof value === "boolean" ? true : !!value
  );

const initialAddress = convertArrayToObjectKey(FormAddress);
const initialBillingAddress = convertArrayToObjectKey(FormBillingAddress);
const initialCreateUser = convertArrayToObjectKey(FormCreateUser);

const Container = styled(Fill)`
  @media (min-width: ${bps["md"]}px) {
    background-color: #f4f5f7;
  }
  overflow-y: scroll;
`;

const TitleHeader = styled.div`
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: normal;
  text-align: left;
  color: ${COLORS.DarkestGreyA47};
`;

const CheckboxWrapper = styled(Checkbox)`
  width: 100%;
  display: flex !important;
  align-items: center !important;
  padding: 6px;
  padding-left: 32px !important;
  :hover {
    border-radius: 6px;
    background-color: #f4f5f7;
  }
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

const CardHeader = styled.div`
  text-align: center;
  p {
    font-size: 16px;
  }
`;

const TabLabel = styled(H5)`
  font-size: 13px;
  line-height: 15px;
  margin-bottom: 0;
`;

const Title = styled(H2)`
  font-size: 30px;
`;

const WrapperTabNumber = styled.div`
  font-size: 11px;
  line-height: 20px;
  color: #fff;
  margin-bottom: 0;
  width: 20px;
  height: 20px;

  margin-right: 8px;
  border-radius: 6px;
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

const ContainerTab = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 24px;
  font-weight: 600;
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

const Content = styled.div``;

const CreateAccountVIew: FunctionComponent = () => {
  const [isSamePickup, setIsSamePickup] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

  const { control: billingAddress, getValues: getValuesBilling } = useForm({
    defaultValues: initialBillingAddress,
  });
  const { control: address, getValues: getValuesAddress } = useForm({
    defaultValues: initialAddress,
  });
  const {
    control: createUser,
    watch,
    getValues: getValuesCreateUser,
  } = useForm({
    defaultValues: initialCreateUser,
  });

  const watchAddress = useWatch({
    control: address,
  });

  const watchBillingAddress = useWatch({
    control: billingAddress,
  });

  const watchBillingCreateUser = useWatch({
    control: createUser,
  });

  useEffect(() => {
    if (tabIndex === 1) return;
    const isFillAllRequiredFieldsAddress =
      checkEmptyValueInObject(watchAddress);
    if (!isSamePickup) {
      const isFillAllRequiredFieldsBilling =
        checkEmptyValueInObject(watchBillingAddress);

      if (isFillAllRequiredFieldsAddress && isFillAllRequiredFieldsBilling) {
        setIsDisableButton(true);
      } else {
        setIsDisableButton(false);
      }
    }
    if (isFillAllRequiredFieldsAddress !== isDisableButton && isSamePickup) {
      setIsDisableButton(isFillAllRequiredFieldsAddress);
    }
  }, [
    watchAddress,
    watchBillingAddress,
    isDisableButton,
    isSamePickup,
    tabIndex,
  ]);

  useEffect(() => {
    if (tabIndex === 0) return;

    const isFillAllRequiredFieldsCreateUser = checkEmptyValueInObject(
      omit(watchBillingCreateUser, ["MiddleInital", "EmailPromotion"])
    );

    if (isFillAllRequiredFieldsCreateUser !== isDisableButton) {
      setIsDisableButton(isFillAllRequiredFieldsCreateUser);
    }
  }, [watchBillingCreateUser, isDisableButton, tabIndex]);

  const onChangeCheckBox = useCallback(
    (event: any) => setIsSamePickup(event.target.checked),
    []
  );

  const isFirstTab = tabIndex === 0;

  const onCreateUser = useCallback(() => {
    const addressValue = getValuesAddress();
    const billingValue = getValuesBilling();
    const createUserValue = getValuesCreateUser();

    console.log("addressValue", addressValue);
    console.log("billingValue", billingValue);
    console.log("createUserValue", createUserValue);

    if (watch("RepeatPassword") !== watch("Password")) {
      setErrorConfirmPassword("Password do not match");
    } else {
      setErrorConfirmPassword("");
      setIsConfirm(true); // Move to confirm page
    }
  }, [getValuesBilling, getValuesAddress, getValuesCreateUser, watch]);

  const onClickNext = useCallback(() => {
    tabIndex === 0 && setTabIndex(tabIndex + 1);
    tabIndex === 1 && onCreateUser();
  }, [tabIndex, onCreateUser]);

  const onClickPrevious = useCallback(() => {
    tabIndex === 1 && setTabIndex(0);
  }, [tabIndex]);

  const backgroundColorFirstTab = {
    backgroundColor: isFirstTab ? COLORS.DarkestGreyA47 : COLORS.Green567,
  };

  const backgroundColorSecondTab = {
    backgroundColor: isFirstTab
      ? COLORS.PlaceholderColor4BEMediumGrey
      : COLORS.DarkestGreyA47,
  };

  const colorFirstTab = {
    color: isFirstTab ? COLORS.DarkestGreyA47 : COLORS.Green567,
  };

  const colorSecondTab = {
    color: isFirstTab
      ? COLORS.PlaceholderColor4BEMediumGrey
      : COLORS.DarkestGreyA47,
  };

  const dataTestidButtonNext = isFirstTab
    ? "button-next"
    : "button-create-user";
  const labelButtonNext = isFirstTab ? "Next Step" : "Create account";
  const title = isFirstTab ? "Create account" : "Create user account";

  const renderItemFirstTab = () => {
    if (isFirstTab) {
      return 1;
    }
    return <Icon className={cls.optionIcon} icon={IconNames.Tick} />;
  };

  return (
    <PublicLayout isHideMenu={isConfirm}>
      {isConfirm ? (
        <ConfirmCreateUser />
      ) : (
        <Container>
          <CardForm elevation={Elevation.TWO} data-testid="create-account-view">
            <Content>
              <CardHeader>
                <Title className="mb-6">{title}</Title>
                <ContainerTab>
                  <WrapperTabNumber style={backgroundColorFirstTab}>
                    {renderItemFirstTab()}
                  </WrapperTabNumber>
                  <TabLabel className="mr-8" style={colorFirstTab}>
                    Address
                  </TabLabel>
                  <WrapperTabNumber style={backgroundColorSecondTab}>
                    2
                  </WrapperTabNumber>
                  <TabLabel style={colorSecondTab}>Create user</TabLabel>
                </ContainerTab>

                {isFirstTab && (
                  <Content>
                    <TitleHeader>Pickup Address</TitleHeader>
                    <FormItem
                      formData={address}
                      formFields={FormAddress as any}
                    />

                    <TitleHeader>Billing Address</TitleHeader>
                    <CheckboxWrapper
                      onChange={onChangeCheckBox}
                      checked={isSamePickup}
                      data-testid="check-box-same-pickup-address"
                      large
                    >
                      <p>Same as Pickup Address</p>
                    </CheckboxWrapper>
                    {!isSamePickup && (
                      <Content data-testid="create-account-billing-address">
                        <FormItem
                          formData={billingAddress}
                          formFields={FormBillingAddress as any}
                        />
                      </Content>
                    )}
                  </Content>
                )}
                {!isFirstTab && (
                  <Content data-testid="create-account-second-tab">
                    <FormItem
                      errorConfirmPassword={errorConfirmPassword}
                      formData={createUser}
                      formFields={FormCreateUser as any}
                    />
                    <SubTitle>
                      By creating an account, you agree to our
                      <NavText> Terms</NavText> &{" "}
                      <NavText>Privacy Policy.</NavText>
                    </SubTitle>
                  </Content>
                )}
              </CardHeader>

              <SubmitInput end={isFirstTab ? "true" : "false"}>
                {!isFirstTab && (
                  <Button
                    onClick={onClickPrevious}
                    className="bp4-intent-primary bp4-large"
                    data-testid="button-previous-step"
                  >
                    Previous step
                  </Button>
                )}
                <Button
                  disabled={!isDisableButton}
                  onClick={onClickNext}
                  className="align-self-end bp4-intent-primary bp4-large"
                  data-testid={dataTestidButtonNext}
                >
                  {labelButtonNext}
                </Button>
              </SubmitInput>
            </Content>
          </CardForm>
        </Container>
      )}
    </PublicLayout>
  );
};

export default CreateAccountVIew;
