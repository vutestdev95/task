import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  gql,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { RestLink } from "apollo-link-rest";
import { onError } from "@apollo/client/link/error";
import { useMemo } from "react";
import { env } from "../config";
import { refreshUserGUID } from "./authentication";

const createApolloClient = (): any => {
  const restLink = new RestLink({
    endpoints: {
      customerPortal: env.restApiCustomerPortalUrl,
    },
    uri: env.restApiUrl,
    // eslint-disable-next-line no-useless-escape
    fieldNameNormalizer: (fieldName) => fieldName.replace(/\:/g, ""),
    responseTransformer: async (response) => {
      const res = await response.json().then((data: any) => {
        if (data?.hasOwnProperty("status") && data?.status === "-9")
          throw new Error("UserGUIDisexpired");
        return data;
      });
      return res;
    },
  });

  const authRestLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }: any) => {
      const UserGUID = localStorage.getItem("UserGUID");
      return {
        headers: {
          ...headers,
          UserGUID: UserGUID || "",
        },
      };
    });
    return forward(operation);
  });

  const errorLink = onError(({ operation, forward, networkError }) => {
    if (networkError?.message !== "UserGUIDisexpired") {
      return;
    }
    const observable = new Observable<FetchResult<Record<string, any>>>(
      (observer) => {
        if (operation.operationName === "RefreshUserGUID") {
          forward(operation).subscribe({
            error: observer.error.bind(observer),
          });
          return;
        }
        const handle = async () => {
          try {
            await refreshToken();
            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            };

            forward(operation).subscribe(subscriber);
          } catch (err) {
            localStorage.clear();
            window.location.href = "/login";
          }
        };
        handle();
      }
    );
    return observable;
  });

  const client = new ApolloClient({
    //concat restLink and httpLink
    link: ApolloLink.from([errorLink, authRestLink, restLink]),
    cache: new InMemoryCache({
      typePolicies: {},
    }),
  });
  const refreshToken = async () => {
    try {
      const refreshResolverResponse = await client
        .mutate({
          mutation: gql(refreshUserGUID),
        })
        .catch((err) => {
          return err;
        })
        .then((res) => res);
      const status = refreshResolverResponse.data?.refreshUserGUID?.status;
      if (status !== "0")
        throw new Error(
          refreshResolverResponse.data?.refreshUserGUID?.statusdescription
        );
      const NewUserGUID =
        refreshResolverResponse.data?.refreshUserGUID?.NewUserGUID;
      const UserGUID = refreshResolverResponse.data?.refreshUserGUID?.UserGUID;
      localStorage.setItem("UserGUID", UserGUID || NewUserGUID);
      return status;
    } catch (err) {
      localStorage.clear();
      throw err;
    }
  };
  return client;
};

export function useApolloClient() {
  const client = useMemo(() => {
    return createApolloClient();
  }, []);
  return client;
}
