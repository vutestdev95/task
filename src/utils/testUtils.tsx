import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const testChangeInput = async (dataTestId: string) => {
  const input = await screen.findByTestId(dataTestId);
  expect(input).toBeInTheDocument();
  userEvent.click(input);
  userEvent.clear(input);
  expect(input).toHaveValue("");
  userEvent.type(input, "value");
  expect(input).toHaveValue("value");
};

export const testChangeSelect = async ({
  dataTestId,
  label,
}: {
  dataTestId: string;
  label: string;
}) => {
  const select = document.querySelector(
    `[data-testid="${dataTestId}"] > .ant-select-selector`
  ) as HTMLElement;
  expect(select).toBeInTheDocument();

  // click on the select input
  fireEvent.mouseDown(select);

  // wait for the ant dropdown element to appear
  await waitFor(() => {
    return expect(
      document.querySelector(".ant-select-dropdown")
    ).toBeInTheDocument();
  });

  const option = document.querySelector(`[label="${label}"]`);
  expect(option).toBeInTheDocument();
  fireEvent.click(option as Element);

  const clickedOption = await screen.findByTestId(`option-with-label-${label}`);
  expect(clickedOption.getAttribute("aria-selected")).toEqual("true");
};

export const testChangeCheckbox = async (dataTestId: string) => {
  const checkbox: HTMLInputElement = await screen.findByTestId(dataTestId);
  expect(checkbox).toBeInTheDocument();
  const checked = checkbox.checked;
  fireEvent.click(checkbox);
  expect(checkbox.checked).toEqual(!checked);
};
