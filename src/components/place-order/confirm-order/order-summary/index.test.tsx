import { act, render, screen } from "@testing-library/react";
import OrderSummary from ".";

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
it("Can render OrderSummary component", () => {
  act(() => {
    render(<OrderSummary></OrderSummary>);

    expect(screen.getByTestId(/order_summary/)).toBeInTheDocument();
  });
});
