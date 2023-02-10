import { act, render, screen } from "@testing-library/react";
import CopyRight from "./CopyRight";

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
it("Can render copyright", () => {
  act(() => {
    render(<CopyRight />);

    expect(screen.getByTestId(/copyright/)).toBeInTheDocument();
  });
});
