import { act, render, screen } from "@testing-library/react";
import SettingContainer from "./SettingContainer";

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
it("Can render HomeView component", () => {
  act(() => {
    render(<SettingContainer></SettingContainer>);

    expect(screen.getByTestId(/setting_container/)).toBeInTheDocument();
  });
});
