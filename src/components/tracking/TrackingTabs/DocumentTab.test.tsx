import { render, screen } from "@testing-library/react";
import { TrackingContext } from "../Detail";
import DocumentsTab from "./DocumentsTab";
import { useMemo } from "react";
import OrderTracking from "../../../services/mockdata/json/OrderTracking.json";
const mockData = {
  order: OrderTracking.Order,
};

it("Can render component", async () => {
  await renderTrackingTabs();
  const component = await screen.findByTestId("tracking-detail-documents");
  expect(component).toBeInTheDocument();
  const items = await screen.findAllByTestId("tracking-detail-documents-item");
  expect(items.length).toEqual(2);
});

export const renderTrackingTabs = async () => {
  render(<Component />);
  const component = await screen.findByTestId("tracking-detail-documents");
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
      <DocumentsTab />
    </TrackingContext.Provider>
  );
};
