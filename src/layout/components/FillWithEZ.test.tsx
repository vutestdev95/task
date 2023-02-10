import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apolloMock } from "../../services/mockdata/apolloMock";
import FillWithEZ from "./FillWithEZ";
it("Can render component", async () => {
  await renderComponent();
  const component = await screen.findByTestId("fill_with_ez");
  userEvent.click(component);
});

export const renderComponent = async () => {
  render(
    <MockedProvider mocks={apolloMock()} addTypename={false}>
      <FillWithEZ UserGUID="{0C0DEC81-AC49-4532-A4E7-C1EF6040B9D3}" />
    </MockedProvider>
  );
  const component = await screen.findByTestId("fill_with_ez");
  expect(component).toBeInTheDocument();
};
