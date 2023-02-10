import { render, screen } from "@testing-library/react";
import { Section } from "./Section";
import user from "@testing-library/user-event";

it("Can render component", async () => {
  await renderComponent();
  const component = await screen.findByTestId("section-test");
  const svgClick = await screen.findByTestId("svg-click");
  expect(component).toBeInTheDocument();
  user.click(svgClick);
});

export const renderComponent = async () => {
  render(
    <Section
      dataTestId="section-test"
      title="Test"
      body={<div></div>}
      hasButtonCollapse
    />
  );
  const component = await screen.findByTestId("section-test");
  expect(component).toBeInTheDocument();
};
