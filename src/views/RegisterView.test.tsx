import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RegisterView from "./RegisterView";
import { FormRegisterUser } from "../components/create-account/formRegisterAccount";
import userEvent from "@testing-library/user-event";

const listInputid = FormRegisterUser.flat().reduce((acc: any, curr: any) => {
  acc.push(curr.dataTestid);
  return acc;
}, []);

jest.mock("react-router-dom", () => ({
  useLocation: () => {
    return {
      pathname: "/register-account",
    };
  },
  useHistory: () => ({
    push: jest.fn(),
  }),
  Link: () => {
    return "";
  },
}));

it("can render component", async () => {
  await renderComponent();
});
it("can input and register", async () => {
  await renderComponent();
  const registerButton = await screen.findByTestId("button-register-account");
  const title = await screen.findByTestId("register-account-title");
  expect(registerButton).toBeInTheDocument();
  expect(title).toBeInTheDocument();
  for await (const id of listInputid) {
    if (id === "address-state") {
      const selectState = screen.getByRole("combobox");
      userEvent.click(selectState);
      const firstItem = await waitFor(() => screen.findByText("Alaska"));
      userEvent.click(firstItem);
    } else {
      const key = await screen.findByTestId(id);
      fireEvent.change(key, {
        target: {
          value: id === "register-user-password" ? "password" : "test",
        },
      });
    }
  }
  fireEvent.click(registerButton); //check not match password
  const passwordInput = await screen.findByTestId("register-user-password");
  fireEvent.change(passwordInput, {
    target: {
      value: "test",
    },
  }); // re-type to match password
  fireEvent.click(registerButton);
  const confirmPage = await screen.findByTestId("confirm-create-user");
  expect(confirmPage).toBeInTheDocument();
});

const renderComponent = async () => {
  render(<RegisterView />);
  const component = await screen.findByTestId("register-account-view");
  expect(component).toBeInTheDocument();
  return component;
};
