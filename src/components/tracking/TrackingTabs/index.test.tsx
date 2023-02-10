import { fireEvent, render, screen } from "@testing-library/react";
import { TrackingContext } from "../Detail";
import TrackingTabs from "./index";
import OrderTracking from "../../../services/mockdata/json/OrderTracking.json";
import { useMemo } from "react";
const mockData = {
  order: OrderTracking.Order,
};

it("Can render component", async () => {
  await renderTrackingTabs();
  const component = await screen.findByTestId("tracking-detail-tabs");
  expect(component).toBeInTheDocument();
});

it("Can action on component", async () => {
  await renderTrackingTabs();
  const stopsTab = await screen.findByTestId("tracking-detail-tab-stops");
  const eventsTab = await screen.findByTestId("tracking-detail-tab-events");
  const documentsTab = await screen.findByTestId(
    "tracking-detail-tab-documents"
  );
  const overviewTab = await screen.findByTestId("tracking-detail-tab-overview");
  expect(stopsTab).toBeInTheDocument();
  expect(eventsTab).toBeInTheDocument();
  expect(documentsTab).toBeInTheDocument();
  expect(overviewTab).toBeInTheDocument();
  fireEvent.click(stopsTab);
  expect(stopsTab.getAttribute("aria-selected")).toEqual("true");
  fireEvent.click(eventsTab);
  expect(eventsTab.getAttribute("aria-selected")).toEqual("true");
  fireEvent.click(documentsTab);
  expect(documentsTab.getAttribute("aria-selected")).toEqual("true");
  fireEvent.click(overviewTab);
  expect(overviewTab.getAttribute("aria-selected")).toEqual("true");
});

export const renderTrackingTabs = async () => {
  render(<Component />);
  const component = await screen.findByTestId("tracking-detail-tabs");
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
      <TrackingTabs />
    </TrackingContext.Provider>
  );
};
