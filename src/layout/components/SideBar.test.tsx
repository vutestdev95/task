import { act, render, screen } from "@testing-library/react";
import SideBar from "./SideBar";

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
it("Can render sidebar", () => {
  act(() => {
    render(<SideBar />);

    expect(screen.getByTestId(/sidebar/)).toBeInTheDocument();
  });
});
