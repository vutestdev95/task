import { render, screen } from "@testing-library/react";
import Summary from "./Summary";
import { values } from "../Quote.test";
import PlaceOrderContextProvider from "../../PlaceOrderProvider";
import ApplicationProvider from "../../../../ApplicationProvider";

it("Can render component", async () => {
  await renderComponent();
  const component = await screen.findByTestId("quote-order-summary");
  expect(component).toBeInTheDocument();
});

export const renderComponent = async () => {
  render(
    <ApplicationProvider>
      <PlaceOrderContextProvider>
        <Summary values={values} />
      </PlaceOrderContextProvider>
    </ApplicationProvider>
  );
  const component = await screen.findByTestId("quote-order-summary");
  expect(component).toBeInTheDocument();
  return component;
};
