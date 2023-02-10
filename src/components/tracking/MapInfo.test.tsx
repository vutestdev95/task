import { render } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { apolloMock } from "../../services/mockdata/apolloMock";
import { TrackingContext } from "./Detail";
import { useMemo } from "react";
import MapInfo, { MapInfoDefault } from "./MapInfo";
import Order from "../../services/mockdata/json/OrderTracking.json";

it("Can render component", async () => {
  await renderComponent();
});

export const renderComponent = async () => {
  render(<Component />);
};

const Component = () => {
  const value = useMemo(
    () => ({
      order: Order.Order,
      loading: false,
    }),
    []
  );

  return (
    <MockedProvider mocks={apolloMock()} addTypename={false}>
      <TrackingContext.Provider value={value}>
        <MapInfo />
        <MapInfoDefault />
      </TrackingContext.Provider>
    </MockedProvider>
  );
};
