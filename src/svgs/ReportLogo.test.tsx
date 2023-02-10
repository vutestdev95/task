import { render } from "@testing-library/react";
import ReportLogo from "./ReportLogo";

it("Can render component", () => {
  render(<ReportLogo />);
});

it("Can render component with color", () => {
  render(<ReportLogo color="red" />);
});
