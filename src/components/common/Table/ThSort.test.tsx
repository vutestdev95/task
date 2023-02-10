import { act, fireEvent, render, screen } from "@testing-library/react";
import { ThSort } from "./ThSort";

jest.mock("react-router-dom", () => ({
  useLocation: () => {
    return {
      pathname: "/tracking",
    };
  },
  Link: () => {
    return "";
  },
}));
it("Can render component", () => {
  act(() => {
    render(
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <ThSort text="test" />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>January</td>
            <td>$100</td>
          </tr>
          <tr>
            <td>February</td>
            <td>$80</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Sum</td>
            <td>$180</td>
          </tr>
        </tfoot>
      </table>
    );

    expect(screen.getByTestId(/thsort/)).toBeInTheDocument();
  });
});

it("can click sort", async () => {
  render(
    <table>
      <thead>
        <tr>
          <th>tsratw</th>
          <ThSort text="test" />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>tsrw</td>
          <td>$tsraw</td>
        </tr>
        <tr>
          <td>atsr</td>
          <td>wftra</td>
        </tr>
      </tbody>
    </table>
  );
  const el = await screen.findByTestId("thsort");
  expect(el).toBeInTheDocument();

  fireEvent.click(el);
  const popover = await screen.findByTestId("popover");
  expect(popover).toBeInTheDocument();
});
