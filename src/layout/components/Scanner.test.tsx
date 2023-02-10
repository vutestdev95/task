import { act, render } from "@testing-library/react";
import Scanner from "./Scanner";

it("Can render scanner", () => {
  act(() => {
    render(<Scanner />);
  });
});
