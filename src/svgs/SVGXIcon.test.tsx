import { render } from "@testing-library/react";
import { SVGXIcon } from "./SVGXIcon";

it("Can render component", () => {
  render(<SVGXIcon />);
});

it("Can render component with class, and function", () => {
  render(<SVGXIcon className="icon" onClick={jest.fn} />);
});
