import { render, screen, within } from "@testing-library/react";
import { TrackingContext } from "../Detail";
import OverviewTab from "./OverviewTab";
import { useMemo } from "react";
import OrderTracking from "../../../services/mockdata/json/OrderTracking.json";
const mockData = {
  order: OrderTracking.Order,
};

it("Can render component", async () => {
  await renderTrackingTabs();
  const component = await screen.findByTestId("tracking-detail-overview");
  const client = await within(
    await screen.findByTestId("tracking-detail-overview-client")
  ).findByText(/QA_Customer2/i);
  const contact = await within(
    await screen.findByTestId("tracking-detail-overview-contact")
  ).findByText(/000-222-333/i);
  const service = await within(
    await screen.findByTestId("tracking-detail-overview-service")
  ).findByText(/NextDay/i);
  const pieces = await within(
    await screen.findByTestId("tracking-detail-overview-pieces")
  ).findByText(/1/i);
  const notes = await within(
    await screen.findByTestId("tracking-detail-overview-notes")
  ).findByText(/Roundtrip: Delivery Order is: 6787/i);
  expect(component).toBeInTheDocument();
  expect(client).toBeInTheDocument();
  expect(contact).toBeInTheDocument();
  expect(service).toBeInTheDocument();
  expect(pieces).toBeInTheDocument();
  expect(notes).toBeInTheDocument();
});

export const renderTrackingTabs = async () => {
  render(<Component />);
  const component = await screen.findByTestId("tracking-detail-overview");
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
      <OverviewTab />
    </TrackingContext.Provider>
  );
};
