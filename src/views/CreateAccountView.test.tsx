import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormCreateUser } from "../components/create-account/formCreateUser";
import { FormAddress } from "../components/create-account/formPickupAddress";
import CreateAccountView from "./CreateAccountView";

const isInputPassword = ["create-user-password", "create-user-repeat-password"];

const listAddressId = FormAddress.flat().reduce((acc: any, curr: any) => {
  acc.push(curr.dataTestid);
  return acc;
}, []);

const listCreateUsersId = FormCreateUser.flat().reduce(
  (acc: any, curr: any) => {
    acc.push(curr.dataTestid);
    return acc;
  },
  []
);

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
  const component = await screen.findByTestId("create-account-view");
  expect(component).toBeInTheDocument();
});

it("Can render billing address component", async () => {
  await renderComponent();
  const checkbox = await screen.findByTestId("check-box-same-pickup-address");
  expect(checkbox).toBeInTheDocument();
  userEvent.click(checkbox);
  const component = await screen.findByTestId("create-account-billing-address");
  expect(component).toBeInTheDocument();
});

it(`Can input form and create a new user`, async () => {
  await renderComponent();
  const buttonNext = await screen.findByTestId("button-next");
  const checkBox = await screen.findByTestId("check-box-same-pickup-address");
  expect(buttonNext).toBeInTheDocument();
  fireEvent.click(checkBox); //checked
  fireEvent.click(checkBox); // unchecked
  // Input form Address
  for await (const id of listAddressId) {
    if (id === "address-state") {
      const periodSelect = screen.getByRole("combobox");
      userEvent.click(periodSelect);
      const firstItem = await waitFor(() => screen.findByText("Alabama"));
      userEvent.click(firstItem);
    } else {
      const username = await screen.findByTestId(id);
      fireEvent.change(username, { target: { value: "Alaska" } });
    }
  }
  fireEvent.click(buttonNext);
  const buttonPrevious = await screen.findByTestId("button-previous-step");
  fireEvent.click(buttonPrevious);
  fireEvent.click(buttonNext);
  const buttonCreate = await screen.findByTestId("button-create-user");

  await waitFor(() => screen.findByTestId("create-account-second-tab"));
  // Input form create user
  for await (const id of listCreateUsersId) {
    if (id === "create-user-security-question") {
      const periodSelect = screen.getByRole("combobox");
      userEvent.click(periodSelect);
      const firstItem = await waitFor(() =>
        screen.findByText("In what city were you born?")
      );
      userEvent.click(firstItem);
    } else {
      if (isInputPassword.includes(id)) {
        const showPassword = await screen.findByTestId(
          `${id}-toogle-show-password`
        );
        userEvent.click(showPassword);
      }
      const key = await screen.findByTestId(id);
      fireEvent.change(key, {
        target: {
          value: id === "create-user-password" ? "password" : "Alaska", // change password value to check case "Password do not match"
        },
      });
    }
  }

  fireEvent.click(buttonCreate); // To check "Password do not match"

  const passwordField = await screen.findByTestId("create-user-password");
  fireEvent.change(passwordField, { target: { value: "Alaska" } });
  fireEvent.click(buttonCreate);
  const confirmCreateUser = await waitFor(() =>
    screen.findByTestId("confirm-create-user")
  );
  expect(confirmCreateUser).toBeInTheDocument();
});

export const renderComponent = async () => {
  render(<CreateAccountView />);
  const component = await screen.findByTestId("create-account-view");
  expect(component).toBeInTheDocument();
  return component;
};
