import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PopOverContent from "./PopoverContent";

it("Can render HomeView component", async () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    const handleClose = jest.fn();
    const handleClick = jest.fn();
    render(
      <PopOverContent
        id="test"
        handleClose={handleClose}
        handleClick={handleClick}
      />
    );
    const popoverContent = await screen.findAllByTestId("pop-over-content");
    userEvent.click(popoverContent[0]);
    expect(popoverContent[0]).toBeVisible();
  });
});
