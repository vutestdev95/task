import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { FormForgotPassword } from "../components/forgot-password/formForgotPassword";

import { ForgotPasswordView } from "./ForgotPasswordView";

const listInput = FormForgotPassword.flat().reduce((acc: any, curr: any) => {
  acc.push(curr.dataTestid);
  return acc;
}, []);

jest.mock("react-router-dom", () => ({
  useLocation: () => {
    return {
      pathname: "/forgot-password",
    };
  },
  useHistory: () => ({
    push: jest.fn(),
  }),
  Link: () => {
    return "";
  },
}));

it("Can render forgot password view", async () => {
  await renderComponent();
  const component = await screen.findByTestId("forgot-password-view");
  expect(component).toBeInTheDocument();
});

it(`Can input form and submit button`, async () => {
  await renderComponent();
  const submitButton = await screen.findByTestId("forgot-password-submit");
  expect(submitButton).toBeInTheDocument();

  for await (const id of listInput) {
    const key = await screen.findByTestId(id);
    fireEvent.change(key, { target: { value: "test value" } });
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  await act(async () => {
    fireEvent.click(submitButton);
  });
  fireEvent.click(submitButton);
  const errorEmail = await waitFor(() => screen.findByTestId("form-error"));
  expect(errorEmail).toBeInTheDocument();
});

export const renderComponent = async () => {
  render(<ForgotPasswordView />);
  const component = await screen.findByTestId("forgot-password-view");
  expect(component).toBeInTheDocument();
  return component;
};
