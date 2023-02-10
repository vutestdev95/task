import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";
import { act } from "react-dom/test-utils";
import PlaceOrderContextProvider from "../components/place-order/PlaceOrderProvider";
import PlaceOrderLayOut from "./PlaceOrderLayout";

import { apolloMock } from "../services/mockdata/apolloMock";
import userEvent from "@testing-library/user-event";
import { PackageDetails } from "../components/place-order/PackageDetails";
import { InMemoryCache } from "@apollo/client";

jest.mock("react-router-dom", () => {
  return {
    useLocation: () => {
      return {
        pathname: "/place-order",
      };
    },
    useHistory: () => ({
      push: jest.fn(),
      block: jest.fn(),
    }),
    Link: () => {
      return "";
    },
  };
});

const renderComponent = () => {
  render(
    <MockedProvider
      mocks={apolloMock()}
      addTypename={false}
      cache={new InMemoryCache()}
    >
      <DndProvider backend={TestBackend}>
        <PlaceOrderContextProvider>
          <PlaceOrderLayOut>
            <PackageDetails />
          </PlaceOrderLayOut>
        </PlaceOrderContextProvider>
      </DndProvider>
    </MockedProvider>
  );
};

it("Can render component", async () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    renderComponent();
    const component = await screen.findByTestId("place-layout");
    expect(component).toBeInTheDocument();
    const btn = await screen.findByTestId("go-to-quote");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
  });
});

it("Can open prompt", async () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    renderComponent();
    const component = await screen.findByTestId("place-layout");
    expect(component).toBeInTheDocument();
    const weight = await screen.findByTestId(`input-weight`);
    expect(weight).toBeInTheDocument();
    fireEvent.change(weight, { target: { value: 5 } });
    const discard = await screen.findByTestId("back-to-detail");
    userEvent.click(discard);
    const discardModal = await screen.findByTestId("confirm-discard");
    expect(discardModal).toBeInTheDocument();
  });
});

it("Can go to quote", async () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    renderComponent();
    const component = await screen.findByTestId("place-layout");
    expect(component).toBeInTheDocument();
    const discard = await screen.findByTestId("go-to-quote");
    userEvent.click(discard);
  });
});

it("Can discard", async () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    renderComponent();
    const component = await screen.findByTestId("place-layout");
    expect(component).toBeInTheDocument();
    const discard = await screen.findByTestId("back-to-detail");
    userEvent.click(discard);
  });
});
