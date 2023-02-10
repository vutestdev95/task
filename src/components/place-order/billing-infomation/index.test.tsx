import { act, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import ReactDOM from "react-dom";
import BillingInfomation from ".";
import { Billing } from "./index.type";
const mockData: Billing = {
  paymentOpitions: "Bill me (Invoice)",
  email: "test",
  phoneNumber: "test",
};
const div = document.createElement("billing");
const mockReturnValue = jest.fn();
describe("billing-infomation", () => {
  it("can render BillingInfomation component", () => {
    render(<BillingInfomation register={mockReturnValue} data={mockData} />);
    expect(screen.getByTestId("billing")).toBeInTheDocument();
  });

  it("should render props correctly", async () => {
    render(<BillingInfomation register={mockReturnValue} data={mockData} />);
    const btnEdit = await screen.findByTestId("btn-edit");
    user.click(btnEdit);
    const toogleExpand = await screen.findByTestId("toogle-expand");
    user.click(toogleExpand);

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      user.click(btnEdit);
    });
  });

  it("should render props correctly2", async () => {
    render(<BillingInfomation register={mockReturnValue} data={mockData} />);
    const btnEdit = await screen.findByTestId("btn-edit");

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      user.click(btnEdit);
    });

    const billingSelect = screen.getByRole("combobox");
    // eslint-disable-next-line testing-library/no-unnecessary-act
    user.click(billingSelect);
  });

  it("should render props uncorrectly", () => {
    ReactDOM.render(<BillingInfomation register={mockReturnValue} />, div);
    render(<BillingInfomation register={mockReturnValue} data={mockData} />);
  });
});
