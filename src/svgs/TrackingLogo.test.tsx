import { render } from "@testing-library/react";
import TrackingLogo from "./TrackingLogo";

it("Can render component", () => {
  render(<TrackingLogo />);
});

it("Can render component with color", () => {
  render(<TrackingLogo color="red" />);
});
