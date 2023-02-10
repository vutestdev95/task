import { act, render, screen } from "@testing-library/react";
import LogoContainer from "./Logo";

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
it("Can render logo", () => {
  act(() => {
    render(<LogoContainer />);

    expect(screen.getByTestId(/logo/)).toBeInTheDocument();
  });
});
