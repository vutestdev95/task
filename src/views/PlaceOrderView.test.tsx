import { MockedProvider } from "@apollo/client/testing";
import { act, render, screen } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";
import PlaceOrderContextProvider from "../components/place-order/PlaceOrderProvider";
import { apolloMock } from "../services/mockdata/apolloMock";
import { PlaceOrderView } from "./PlaceOrderView";

jest.mock("react-router-dom", () => ({
  useLocation: () => {
    return {
      pathname: "/tracking",
    };
  },
  Link: () => {
    return "";
  },
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

const renderComponent = () => {
  render(
    <MockedProvider mocks={apolloMock()} addTypename={false}>
      <DndProvider backend={TestBackend}>
        <PlaceOrderContextProvider>
          <PlaceOrderView />
        </PlaceOrderContextProvider>
      </DndProvider>
    </MockedProvider>
  );
};

it("Can render 7 sections place order page", async () => {
  await act(async () => {
    renderComponent();

    expect(await screen.findByTestId("place-layout")).toBeInTheDocument();
    expect(
      await screen.findByTestId("place-order-stops-section")
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId("section-delivery-date")
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId("section-order-references")
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId("section-package-details")
    ).toBeInTheDocument();
    expect(await screen.findByTestId("save-ez-ship")).toBeInTheDocument();
    expect(await screen.findByTestId("notifications")).toBeInTheDocument();
    expect(await screen.findByTestId("billing")).toBeInTheDocument();
    expect(screen.getByText(/Order Ready By/)).toBeInTheDocument();
  });
});
