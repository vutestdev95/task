import { fireEvent, render, screen, within } from "@testing-library/react";
import { TrackingContext } from "../Detail";
import EventTab from "./EventTab";
import { useMemo } from "react";
import OrderTracking from "../../../services/mockdata/json/OrderTracking.json";
const mockData = {
  order: OrderTracking.Order,
};

it("Can render component", async () => {
  await renderTrackingTabs();
  const component = await screen.findByTestId("tracking-detail-events");
  expect(component).toBeInTheDocument();
  const items = await screen.findAllByTestId("tracking-detail-events-item");
  expect(items.length).toEqual(105);
  const firstItem = await within(items[0]).findByText("test first");
  expect(firstItem).toBeInTheDocument();
  const sortBtn = await screen.findByTestId("tracking-detail-events-sort");
  expect(sortBtn).toBeInTheDocument();
  fireEvent.click(sortBtn);
  const itemsBeforeSort = await screen.findAllByTestId(
    "tracking-detail-events-item"
  );
  const firstItemBeforeSort = await within(itemsBeforeSort[0]).findByText(
    "test last"
  );
  expect(firstItemBeforeSort).toBeInTheDocument();
});

export const renderTrackingTabs = async () => {
  render(<Component />);
  const component = await screen.findByTestId("tracking-detail-events");
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
      <EventTab />
    </TrackingContext.Provider>
  );
};
