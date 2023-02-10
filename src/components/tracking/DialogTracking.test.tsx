import { fireEvent, render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { apolloMock } from "../../services/mockdata/apolloMock";
import OrderTracking from "../../services/mockdata/json/OrderTracking.json";
import { TrackingContext } from "./Detail";
import { useCallback, useEffect, useMemo, useRef } from "react";
import DialogTracking, { DialogTrackingRef } from "./DialogTracking";

it("Can render component", async () => {
  renderComponent();
  const component = await screen.findByTestId("drawer-detal-custom");
  expect(component).toBeInTheDocument();
});

it("Can close component", async () => {
  renderComponent();
  const component = await screen.findAllByTestId("close-button");
  expect(component[0]).toBeInTheDocument();
  fireEvent.click(component[0]);
});

export const renderComponent = () => {
  render(<Component />);
};

const Component = () => {
  const ref = useRef<DialogTrackingRef>(null);

  useEffect(() => {
    ref.current?.open();
  }, []);

  const value = useMemo(
    () => ({
      order: OrderTracking?.Order,
      loading: false,
    }),
    []
  );

  const onClose = useCallback(() => {}, []);
  const onRefetch = useCallback(() => {}, []);

  return (
    <MockedProvider mocks={apolloMock()} addTypename={false}>
      <TrackingContext.Provider value={value}>
        <DialogTracking ref={ref} onClose={onClose} onRefetch={onRefetch} />
      </TrackingContext.Provider>
    </MockedProvider>
  );
};
