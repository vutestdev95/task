import { act, render, screen } from "@testing-library/react";
import { ReportView } from "./ReportView";

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
it("Can render ReportView component", () => {
  act(() => {
    render(<ReportView></ReportView>);

    expect(screen.getByTestId(/title-report/)).toBeInTheDocument();
  });
});
