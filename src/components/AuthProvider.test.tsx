import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import ApplicationProvider from "../ApplicationProvider";
import { apolloMock } from "../services/mockdata/apolloMock";
import AuthProvider from "./AuthProvider";

it("Can render component", async () => {
  localStorage.setItem("UserGUID", "{90EA88CD-035E-469F-82BA-CFF38C4D1027}");
  localStorage.setItem(
    "user",
    `{"name":"Evizi1","legacyUserId":"{AF480434-5FA3-4E49-8285-D62DBF4748EB}"}`
  );
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await renderComponent();
});

it("Can get customer info faild", async () => {
  localStorage.removeItem("UserGUID");
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await renderComponent();
});

export const renderComponent = async () => {
  await waitFor(() => {
    return render(
      <MockedProvider mocks={apolloMock()} cache={new InMemoryCache()}>
        <ApplicationProvider>
          <AuthProvider>
            <div data-testid="auth-provider"></div>
          </AuthProvider>
        </ApplicationProvider>
      </MockedProvider>
    );
  });
  const component = await screen.findByTestId("auth-provider");
  expect(component).toBeInTheDocument();
  return component;
};
