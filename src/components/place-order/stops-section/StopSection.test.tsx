import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { apolloMock } from "../../../services/mockdata/apolloMock";
import PlaceOrderContextProvider from "../PlaceOrderProvider";
import StopSection from "./index";

jest.mock("react-router-dom", () => ({
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
}));

describe("Test", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      value: () => {
        return {
          matches: false,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      },
    });
  });

  it("Can render component", async () => {
    await renderComponent();
    const component = await screen.findByTestId("place-order-stops-section");
    expect(component).toBeInTheDocument();
    const items = await screen.findAllByTestId("place-order-stops-item");
    expect(items.length).toEqual(2);
    const addStopBtn = await within(items[0]).findByTestId(
      "place-order-stops-item-add-stop"
    );
    expect(addStopBtn).toBeInTheDocument();
    fireEvent.click(addStopBtn);
    const items2 = await screen.findAllByTestId("place-order-stops-item");
    expect(items2.length).toEqual(3);
  });

  it("Can render component item view", async () => {
    await renderComponent();
    const prevItems = await screen.findAllByTestId("place-order-stops-item");
    expect(prevItems.length).toEqual(2);
    const switchToView = await within(prevItems[0]).findByTestId(
      "place-order-stops-item-edit-switch-to-view"
    );
    expect(switchToView).toBeInTheDocument();
    fireEvent.click(switchToView);
    const item = await screen.findByTestId("place-order-stops-item-view");
    const statusElement = await within(item).findByTestId(
      "place-order-stops-item-view-status"
    );
    expect(statusElement).toBeInTheDocument();
    const addressElement = await within(item).findByTestId(
      "place-order-stops-item-view-address"
    );
    expect(addressElement).toBeInTheDocument();
    const contactElement = await within(item).findByTestId(
      "place-order-stops-item-view-contact"
    );
    expect(contactElement).toBeInTheDocument();
  });

  it("Can render component item edit", async () => {
    await renderComponent();
    const items = await screen.findAllByTestId("place-order-stops-item");
    expect(items.length).toEqual(2);
    const statusElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-status"
    );
    expect(statusElement).toBeInTheDocument();
    const searchAddressElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-search-address"
    );
    expect(searchAddressElement).toBeInTheDocument();
    const nameElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-name"
    );
    expect(nameElement).toBeInTheDocument();
    const addressElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-address"
    );
    expect(addressElement).toBeInTheDocument();
    const buildingElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-building"
    );
    expect(buildingElement).toBeInTheDocument();
    const stateElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-state"
    );
    expect(stateElement).toBeInTheDocument();
    const zipElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-zip"
    );
    expect(zipElement).toBeInTheDocument();
    const residenceElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-residence"
    );
    expect(residenceElement).toBeInTheDocument();
    const notesElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-notes"
    );
    expect(notesElement).toBeInTheDocument();
    const phoneElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-phone"
    );
    expect(phoneElement).toBeInTheDocument();
    const emailElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-email"
    );
    expect(emailElement).toBeInTheDocument();
    const saveAddressElement = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-save-address"
    );
    expect(saveAddressElement).toBeInTheDocument();
    const clearForm = await within(items[0]).findByTestId(
      "place-order-stops-item-edit-clear-form"
    );
    expect(clearForm).toBeInTheDocument();
    fireEvent.click(clearForm);
  });
});

export const renderComponent = async () => {
  render(
    <MockedProvider mocks={apolloMock()} addTypename={false}>
      <DndProvider backend={HTML5Backend}>
        <PlaceOrderContextProvider>
          <StopSection />
        </PlaceOrderContextProvider>
      </DndProvider>
    </MockedProvider>
  );
  const component = await screen.findByTestId("place-order-stops-section");
  expect(component).toBeInTheDocument();
  return component;
};
