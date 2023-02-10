import { render } from "@testing-library/react";
import OrderLogo from "./OrderLogo";

it("Can render component", () => {
  render(<OrderLogo />);
});

it("Can render component with color", () => {
  render(<OrderLogo color="red" />);
});
