import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { OrderReferences } from "./OrderReferences";
import PlaceOrderContextProvider from "./PlaceOrderProvider";
const renderComponent = () => {
  render(
    <PlaceOrderContextProvider>
      <OrderReferences />
    </PlaceOrderContextProvider>
  );
};

it("Can render title section order references", () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => {
    renderComponent();
    expect(screen.getByText("Order References")).toBeInTheDocument();
  });
});

it("Can check validate format", async () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => {
    renderComponent();
    expect(screen.getByText("Order References")).toBeInTheDocument();
  });

  const reference1Input = await screen.findByTestId("input-order-reference-0");
  userEvent.type(reference1Input, "---");

  const reference2Input = await screen.findByTestId("input-order-reference-1");
  userEvent.type(reference2Input, "---");
});
