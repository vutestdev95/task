import { fireEvent, render, screen, within } from "@testing-library/react";
import { TrackingContext } from "./Detail";
import TrackingInfo from "./TrackingInfo";
import { useMemo } from "react";
import OrderTracking from "../../services/mockdata/json/OrderTracking.json";
const mockData = {
  order: OrderTracking.Order,
};

it("Can render component", async () => {
  await renderTrackingInfor();
  const component = await screen.findByTestId("tracking-detail");
  expect(component).toBeInTheDocument();
});

it("Can render information", async () => {
  await renderTrackingInfor();
  const id = await within(
    await screen.findByTestId("tracking-detail-id")
  ).findByText(/Order #6786/);
  const status = await within(
    await screen.findByTestId("tracking-detail-status")
  ).findByText(/COMPLETED/i);
  const eta = await within(
    await screen.findByTestId("tracking-detail-eta")
  ).findByText(/November 1, 2022 5:00 PM/);
  const address = await within(
    await screen.findByTestId("tracking-detail-latest-activity-address")
  ).findByText(/1344 Hillridge Way, Zeeland, PA 17582/);
  const latestActivityStatus = await within(
    await screen.findByTestId("tracking-detail-latest-activity-status")
  ).findByText(/DROPPED OFF/);
  expect(id).toBeInTheDocument();
  expect(status).toBeInTheDocument();
  expect(eta).toBeInTheDocument();
  expect(address).toBeInTheDocument();
  expect(latestActivityStatus).toBeInTheDocument();
  const event = await screen.findByTestId(
    "tracking-detail-latest-activity-event"
  );
  expect(event).toBeInTheDocument();
  const eventTitle = await within(event).findByText(/Changed - test/i);
  const eventDate = await within(event).findByText(/October 31, 3:45 am/i);
  expect(eventTitle).toBeInTheDocument();
  expect(eventDate).toBeInTheDocument();
  const refresh = await screen.findByTestId("tracking-detail-refresh");
  fireEvent.click(refresh);
});

export const renderTrackingInfor = async () => {
  render(<Component />);
  const component = await screen.findByTestId("tracking-detail");
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
      <TrackingInfo onClose={jest.fn} reload={jest.fn} />
    </TrackingContext.Provider>
  );
};
