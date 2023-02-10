import { fireEvent, render, screen, within } from "@testing-library/react";
import { useMemo } from "react";
import { TrackingContext } from "../Detail";
import StopsTab from "./StopsTab";
import OrderTracking from "../../../services/mockdata/json/OrderTracking.json";
const mockData = {
  order: OrderTracking.Order,
};

it("Can render component", async () => {
  await renderStopsTab();
  const component = await screen.findByTestId("tracking-detail-stops");
  expect(component).toBeInTheDocument();
  const items = await screen.findAllByTestId("tracking-detail-stops-item");
  expect(items.length).toEqual(2);
  const firstItem = within(items[0]);
  const firstItemId = await firstItem.findByText(/Stop #17342/);
  const firstItemStatus = await within(
    firstItem.getByTestId("tracking-detail-stops-item-status")
  ).findByText(/Picked up/i);
  expect(firstItemId).toBeInTheDocument();
  expect(firstItemStatus).toBeInTheDocument();
  const sortBtn = await screen.findByTestId("tracking-detail-stops-sort");
  expect(sortBtn).toBeInTheDocument();
  fireEvent.click(sortBtn);
  const itemsBeforeSort = await screen.findAllByTestId(
    "tracking-detail-stops-item"
  );
  const firstItemBeforeSort = await within(itemsBeforeSort[0]).findByText(
    /Stop #17343/
  );
  expect(firstItemBeforeSort).toBeInTheDocument();
});

export const renderStopsTab = async () => {
  render(<Component />);
  const component = await screen.findByTestId("tracking-detail-stops");
  expect(component).toBeInTheDocument();
  return component;
};

const Component = () => {
  const value = useMemo(
    () => ({
      loading: false,
      order: mockData.order,
    }),
    []
  );

  return (
    <TrackingContext.Provider value={value}>
      <StopsTab />
    </TrackingContext.Provider>
  );
};
