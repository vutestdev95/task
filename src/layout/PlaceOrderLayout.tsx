import { Button, Divider, Icon, Spinner } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import styled from "@emotion/styled";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  bps,
  Constants,
  breakpointToggleSidebar,
} from "../components/common/Constants";
import { usePlaceOrder } from "../components/place-order/PlaceOrderProvider";
import { useSaveOrdersMutation } from "../generated/graphql";
import * as variable from "../utils/variable";
import FillWithEZ from "./components/FillWithEZ";
import Scanner from "./components/Scanner";
import ModalConfirmDiscard, {
  ModalConfirmDiscardRefs,
} from "../components/place-order/ModalConfirmDiscard";
import useExitPrompt from "../hooks/useExitPrompt";
import { useFormState } from "react-hook-form";
import Prompt from "../components/common/Prompt";
import { valuesToInputPlaceOrderStops } from "../utils/generals";
import { CustomButtonPrimary } from "../components/common/CustomButton";

const { ROUTES } = Constants;

const isQuoteToLabel = (isQuote: boolean) => ({
  title: isQuote ? "Quote order" : "Place Order",
  discard: isQuote ? "Back to Order Details" : "Discard order",
  action: !isQuote ? "Quote this order" : "Place this order",
});

const PlaceOrderLayOut: FunctionComponent = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const {
    validate,
    formState: { setValue },
  } = usePlaceOrder();

  const discardModal = useRef<ModalConfirmDiscardRefs>(null);

  const [mutationSaveOrders, { loading }] = useSaveOrdersMutation();
  const {
    getValues,
    control,
    reset: resetAllFields,
  } = usePlaceOrder().formState;
  const { isDirty } = useFormState({ control });
  const { setShowExitPrompt } = useExitPrompt(false);
  const [showMyPrompt, setShowMyPrompt] = useState<boolean>(false);

  const isQuote = location.pathname === ROUTES.quoteOrder;

  useEffect(() => {
    setShowExitPrompt(isDirty);
  }, [isDirty, setShowExitPrompt]);

  const gotoQuoteOrder = useCallback(async () => {
    setValue("forward", true);
    const error = await validate();
    if (error) history.push(ROUTES.quoteOrder);
  }, [history, validate, setValue]);

  const backToDetail = useCallback(() => {
    history.push(ROUTES.placeOrder);
  }, [history]);

  const cancelDiscard = useCallback(() => {
    setShowMyPrompt(false);
  }, [setShowMyPrompt]);

  const resetForm = useCallback(() => {
    resetAllFields();
    cancelDiscard();
    history.push(ROUTES.home);
  }, [resetAllFields, cancelDiscard, history]);

  const discard = useCallback(() => {
    if (isDirty) {
      setShowMyPrompt(true);
      discardModal?.current?.open();
    } else resetForm();
  }, [isDirty, resetForm]);

  const handlePlaceOrder = useCallback(async () => {
    const error = await validate();
    const values = getValues();
    if (error) {
      const stops = valuesToInputPlaceOrderStops(values);
      const res = await mutationSaveOrders({
        variables: {
          input: {
            Order: {
              CustomerCode: "10017",
              Service: values.deliveryServiceType,
              Auth: "10017",
              Pieces: {
                Piece: [
                  {
                    Sequence: "1",
                    Reference: "test1234barcode",
                    Pieces: "1",
                  },
                  {
                    Sequence: "2",
                    Reference: "test1235barcode",
                    Pieces: "5",
                  },
                ],
              },
              Stops: {
                Stop: stops,
              },
            },
          },
        },
      });
      if (res?.data?.saveOrders?.Status.OrderID) {
        resetAllFields();
        return history.push(
          `${ROUTES.placeOrder}/confirm/${res?.data?.saveOrders?.Status.OrderID}`
        );
      }
    }
  }, [getValues, history, mutationSaveOrders, resetAllFields, validate]);

  const handlePrompt = useCallback((location, action: any) => {
    if (
      location.pathname === ROUTES.placeOrder ||
      location.pathname === ROUTES.quoteOrder
    )
      return true;
    discardModal.current?.open({
      event: action,
      router: location.pathname,
    });
    setShowMyPrompt(true);
    return false;
  }, []);

  const whenUsePrompt = useMemo(
    () => isDirty && !showMyPrompt,
    [isDirty, showMyPrompt]
  );

  return loading ? (
    <LoadingContainer data-testid="loading-screen">
      <Spinner />
    </LoadingContainer>
  ) : (
    <Wrapper data-testid="place-layout">
      <Header>
        <Title>Place Order</Title>
        <HeaderContent>
          <Scanner />
          <FillWithEZ />
        </HeaderContent>
      </Header>
      <Divider />
      <HeaderMobile>
        <FlexContainer2>
          <Title>{isQuoteToLabel(isQuote).title}</Title>
          {!isQuote && <FillWithEZ />}
        </FlexContainer2>
      </HeaderMobile>
      <Content>{children}</Content>
      <Footer>
        <Divider />
        <FlexContainer>
          {isQuote ? (
            <div data-testid="back-to-detail" onClick={backToDetail}>
              <TitleDisCard style={{ color: "#394048" }}>
                {isQuoteToLabel(isQuote).discard}
              </TitleDisCard>
            </div>
          ) : (
            <div data-testid="back-to-detail" onClick={discard}>
              <TitleDisCard>{isQuoteToLabel(isQuote).discard}</TitleDisCard>
            </div>
          )}
          <ButtonGroup>
            {!isQuote && (
              <ButtonCustom
                onClick={handlePlaceOrder}
                data-testid="place-order-act"
              >
                Place this order
              </ButtonCustom>
            )}

            <CustomButtonPrimary
              data-testid="go-to-quote"
              text={isQuoteToLabel(isQuote).action}
              width={166}
              onClick={gotoQuoteOrder}
            />
          </ButtonGroup>
        </FlexContainer>
      </Footer>
      <FooterMobile>
        <DisCardOrder onClick={discard}>
          <Icon icon="trash" color="#fa545e" />
          <TitleDisCard>Discard order</TitleDisCard>
        </DisCardOrder>
        <Divider />
        {!isQuote ? (
          <ButtonGroup2>
            <ButtonCustom onClick={handlePlaceOrder}>Place order</ButtonCustom>
            <ButtonQuote onClick={gotoQuoteOrder}>Quote order</ButtonQuote>
          </ButtonGroup2>
        ) : (
          <ButtonGroup2>
            <ButtonCustomBack outlined onClick={backToDetail}>
              <Icon
                icon={IconNames.ArrowLeft}
                style={{ marginRight: 4, color: "#102a47" }}
              />
              Edit order
            </ButtonCustomBack>
            <ButtonQuote onClick={gotoQuoteOrder}>Place order</ButtonQuote>
          </ButtonGroup2>
        )}
      </FooterMobile>
      <ModalConfirmDiscard
        ref={discardModal}
        onConfirm={resetForm}
        onCancel={cancelDiscard}
      />
      <Prompt when={whenUsePrompt} message={handlePrompt} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: ${variable.DEFAULT_BG_PLACE_ORDER};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  padding: 32px;
  padding-bottom: 16px;
  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    display: none;
  }
`;
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
const TitleDisCard = styled.p`
  color: #394048;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: justify;
  cursor: pointer;
`;
const HeaderMobile = styled.div`
  display: none;
  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    display: block;
  }
`;
const DisCardOrder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7px;
  padding-left: 27px;
  padding-right: 27px;
  height: 48px;
  background: #fff;
  margin-bottom: 24px;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 40px;
  color: #102a47;
  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    font-size: 30px;
  }
`;

const Footer = styled.div`
  display: block;
  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    display: none;
  }
`;
const FooterMobile = styled.div`
  display: none;
  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    display: block;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Content = styled.div`
  flex: 1;
  overflow-y: scroll;
  padding-top: 16px;
  @media (min-width: ${bps["sm"]}px) {
    padding-left: 12px;
    padding-right: 12px;
  }
  @media (min-width: ${bps["md"]}px) {
    padding-left: 16px;
    padding-right: 16px;
  }
  @media (min-width: ${bps["lg"]}px) {
  }
  @media (min-width: ${bps["xl"]}px) {
    padding-left: 32px;
    padding-right: 32px;
  }
  @media (min-width: ${bps["2xl"]}px) {
  }
`;
const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  padding-bottom: 10px;
  padding-left: 32px;
  padding-right: 32px;
  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    flex-direction: column;
    gap: 24px;
  }
`;
const FlexContainer2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;
const ButtonCustom = styled(Button)`
  height: 40px;
  border-radius: 6px;
  background: #ffffff !important;
  color: #102a47 !important;
  box-shadow: 0px 2px 1px rgba(44, 58, 110, 0.06) !important;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  padding: 10px 24px;
`;

const ButtonCustomBack = styled(Button)`
  height: 40px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: justify;
  color: #102a47;
  padding: 10px 24px;
  border: none !important;
`;

const ButtonQuote = styled(Button)`
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
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;
const ButtonGroup2 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin: 24px;
`;

export default PlaceOrderLayOut;
