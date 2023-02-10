import ReactDOM from "react-dom";
import { act, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { Notification } from "./index.type";
import Notifications from ".";
const mockData: Notification = {
  email: "test",
  textMessage: "test",
  status: "test",
};
const div = document.createElement("notifications");
const mockReturnValue = jest.fn();
describe("test-notifications", () => {
  it("Can render collapse", async () => {
    render(<Notifications register={mockReturnValue} data={mockData} />);
    const btnArrow = await screen.findByTestId("button-arrow");
    user.click(btnArrow);
    user.click(btnArrow);
  });

  it("Can render default notification section", async () => {
    render(<Notifications register={mockReturnValue} data={mockData} />);
    const notificationEmail = await screen.findByTestId("notification-email");
    expect(notificationEmail).toBeInTheDocument();
    const notifyEmailLabel = await screen.findByTestId(
      "notification-notify-email"
    );
    expect(notifyEmailLabel).toBeInTheDocument();
    const textMessageLabel = await screen.findByTestId(
      "notification-text-message"
    );
    expect(textMessageLabel).toBeInTheDocument();
    const notifyTextMessageLabel = await screen.findByTestId(
      "notification-notify-text-message"
    );
    expect(notifyTextMessageLabel).toBeInTheDocument();
  });

  it("should render props correctly", async () => {
    render(<Notifications register={mockReturnValue} data={mockData} />);
    const btnEdit = await screen.findByTestId("btn-edit");
    user.click(btnEdit);
    const btnAdd = await screen.findByTestId("notification-button-add");

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      user.click(btnAdd);
    });
    const btnRemove = await screen.findByTestId("notification-button-remove");
    user.click(btnRemove);
    user.click(btnAdd);
    const inputValue = await screen.findByTestId("input");
    user.type(inputValue, "value");
  });

  it("should render props uncorrectly", () => {
    ReactDOM.render(<Notifications register={mockReturnValue} />, div);
    render(<Notifications register={mockReturnValue} data={mockData} />);
  });
});
