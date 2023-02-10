import { act, render, screen } from "@testing-library/react";
import { HomeView } from "./HomeView";

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
it("Can render HomeView component", () => {
  act(() => {
    render(<HomeView></HomeView>);

    expect(screen.getByTestId(/title-dashboard/)).toBeInTheDocument();
  });
});
