import { act, render, screen } from "@testing-library/react";
import { CustomButtonPrimary, CustomButtonSecondary } from "./CustomButton";

it("Can render button Primary", () => {
  act(() => {
    render(
      <CustomButtonPrimary
        width={"auto"}
        {...{
          text: "Button Primary",
        }}
      />
    );

    expect(screen.getByText(/Button Primary/)).toBeInTheDocument();
  });
});

it("Can render button Secondary", () => {
  act(() => {
    render(
      <CustomButtonSecondary
        blackOrBlue="black"
        largeOrSmallText="large"
        width={"auto"}
        {...{
          text: "Button Secondary",
        }}
      />
    );

    expect(screen.getByText(/Button Secondary/)).toBeInTheDocument();
  });
});
