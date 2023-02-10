import { act, render, screen } from "@testing-library/react";
import { Icon } from "@blueprintjs/core";

import {
  CENTER,
  DEFAULT_ZOOOM,
  GoogleApiKey,
  headerColumnsAction,
  headerColumnsNoAction,
  renderIcon,
  URL_GOOGLE_KEY,
} from "./contants";

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
it("renderIcon", async () => {
  await act(async () => {
    render(<div>{renderIcon("P")}</div>);

    expect(screen.getByTestId(/arrow_up/)).toBeInTheDocument();
  });
});

it("URL_GOOGLE_KEY", () => {
  expect(URL_GOOGLE_KEY.length).toBeGreaterThan(2);
});
it("GoogleApiKey", () => {
  expect(GoogleApiKey.length).toBeGreaterThan(2);
});
it("CENTER", () => {
  expect(CENTER.lat).not.toBeNull();
});
it("DEFAULT_ZOOOM", () => {
  expect(DEFAULT_ZOOOM).toBeGreaterThan(1);
});

it("headerColumnsAction", () => {
  expect(headerColumnsAction).toHaveLength(6);
});

it("headerColumnsNoAction", () => {
  expect(headerColumnsNoAction).toHaveLength(5);
});
it("render icon", () => {
  expect(renderIcon("P")).toStrictEqual(
    <Icon data-testid="arrow_up" icon="arrow-up" />
  );
});
