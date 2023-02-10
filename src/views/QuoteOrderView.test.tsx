import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen } from "@testing-library/react";
import PlaceOrderContextProvider from "../components/place-order/PlaceOrderProvider";
import { apolloMock } from "../services/mockdata/apolloMock";
import { QuoteOrderView } from "./QuoteOrderView";

jest.mock("react-router-dom", () => ({
  useLocation: () => {
    return {
      pathname: "/place-order/quote",
    };
  },
  useHistory: () => ({
    push: jest.fn(),
  }),
  Link: () => {
    return "";
  },
}));

it("Can render component", async () => {
  await renderComponent();
  const component = await screen.findByTestId("quote-order-view");
  expect(component).toBeInTheDocument();
});

it("Can back to detail", async () => {
  await renderComponent();
  const goToQuote = await screen.findByTestId("back-to-detail");
  expect(goToQuote).toBeInTheDocument();
  fireEvent.click(goToQuote);
});

export const renderComponent = async () => {
  render(
    <PlaceOrderContextProvider>
      <MockedProvider mocks={apolloMock()} addTypename={false}>
        <QuoteOrderView />
      </MockedProvider>
    </PlaceOrderContextProvider>
  );
  const component = await screen.findByTestId("quote-order-view");
  expect(component).toBeInTheDocument();
  return component;
};
