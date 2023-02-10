import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PlaceOrderContextProvider from "../../PlaceOrderProvider";
import StopItem from "./StopItem";

it("Can render component", async () => {
  await renderComponent();
});

it("Can hover component", async () => {
  await renderComponent();
  const component = await screen.findByTestId("place-order-stops-item-edit");
  expect(component).toBeInTheDocument();
  userEvent.dblClick(component);
});

it("Can render view item", async () => {
  render(
    <DndProvider backend={HTML5Backend}>
      <PlaceOrderContextProvider>
        <StopItem
          field={{
            edit: false,
          }}
          id="341#q"
          index={0}
          lastItem
          moveCard={jest.fn}
          onAddStop={jest.fn}
          onRemoveStop={jest.fn}
          onResetStop={jest.fn}
          onUpdateValue={jest.fn}
        />
      </PlaceOrderContextProvider>
    </DndProvider>
  );
  const component = await screen.findByTestId("place-order-stops-item-view");
  expect(component).toBeInTheDocument();
});

const renderComponent = async () => {
  render(
    <DndProvider backend={HTML5Backend}>
      <PlaceOrderContextProvider>
        <StopItem
          field={{
            edit: true,
          }}
          id="341#q"
          index={0}
          lastItem
          moveCard={jest.fn}
          onAddStop={jest.fn}
          onRemoveStop={jest.fn}
          onResetStop={jest.fn}
          onUpdateValue={jest.fn}
        />
      </PlaceOrderContextProvider>
    </DndProvider>
  );
  const component = await screen.findByTestId("place-order-stops-item");
  expect(component).toBeInTheDocument();
  return component;
};
