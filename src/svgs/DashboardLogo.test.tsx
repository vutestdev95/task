import { render } from "@testing-library/react";
import DashboardLogo from "./DashboardLogo";

it("Can render component", () => {
  render(<DashboardLogo />);
});

it("Can render component with color", () => {
  render(<DashboardLogo color="red" />);
});
