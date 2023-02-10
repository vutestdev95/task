import { fireEvent, render, screen } from "@testing-library/react";
import { ConfirmCreateUser } from "./ConfirmCreateUser";

jest.mock("react-router-dom", () => ({
  useLocation: () => {
    return {
      pathname: "/create-account",
    };
  },
  useHistory: () => ({
    push: jest.fn(),
  }),
  Link: () => {
    return "";
  },
}));

it("Can render tab address component", async () => {
  await renderComponent();
  const component = await screen.findByTestId("confirm-create-user");
  expect(component).toBeInTheDocument();
});

it("Can render submit button and go to dashboard", async () => {
  await renderComponent();
  const buttonSubmit = await screen.findByTestId("confirm-create-submit");
  expect(buttonSubmit).toBeInTheDocument();
  fireEvent.click(buttonSubmit);
});

export const renderComponent = async () => {
  render(<ConfirmCreateUser />);
  const component = await screen.findByTestId("confirm-create-user");
  expect(component).toBeInTheDocument();
  return component;
};
