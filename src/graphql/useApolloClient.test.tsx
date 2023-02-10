import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCallback } from "react";
import { refreshUserGUID, testUserGUIDExpire } from "./authentication";
import { useApolloClient } from "./useApolloClient";

const mockdata = [
  {
    request: {
      query: gql(testUserGUIDExpire),
    },
    result: {
      loading: true,
      error: undefined,
      data: {
        testUserGUIDExpire: {
          status: "-9",
          statusdescription: "UserGUID expired",
        },
      },
    },
  },
  {
    request: {
      query: gql(refreshUserGUID),
    },
    result: {
      loading: true,
      error: undefined,
      data: {
        testUserGUIDExpire: {
          status: "0",
          NewUserGUID: "{03F13AF7-811A-41F5-B3B5-66B516981723}",
        },
      },
    },
  },
];

it("Can render hook", async () => {
  await waitFor(() => {
    return render(
      <MockedProvider mocks={mockdata}>
        <Component />
      </MockedProvider>
    );
  });
  const elementLoading = await screen.findByTestId("test-apollo");
  userEvent.click(elementLoading);
});

const Component = () => {
  const client = useApolloClient();

  const callApi = useCallback(async () => {
    const data = await client.mutate({
      mutation: gql(testUserGUIDExpire),
    });
    console.log(data);
  }, [client]);

  return <div data-testid="test-apollo" onClick={callApi}></div>;
};
