import { MockedProvider } from "@apollo/client/testing";
import { act, render, screen } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";
import { apolloMock } from "../services/mockdata/apolloMock";

import { TrackingView } from "./TrackingView";

jest.mock("react-router-dom", () => ({
  useLocation: () => {
    return {
      pathname: "/tracking",
    };
  },
  Link: () => {
    return "";
  },
}));
it("Can render TrackingView component", () => {
  render(
    <DndProvider backend={TestBackend}>
      <MockedProvider mocks={apolloMock()} addTypename={false}>
        <TrackingView />
      </MockedProvider>
    </DndProvider>
  );
  act(() => {
    expect(screen.getByTestId(/tracking-view/)).toBeInTheDocument();
  });
});
