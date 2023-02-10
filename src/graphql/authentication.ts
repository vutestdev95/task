export const login = /*GraphQL*/ `
    mutation Login($input: LoginInput!) {
        login(input: $input)
        @rest(
          type: "LoginResponse"
          path: "/Login"
          method: "POST"
        ) {
            status
            UserGUID
            statusdescription
        }
    }
`;

export const refreshUserGUID = /*GraphQL*/ `
    mutation RefreshUserGUID {
        refreshUserGUID
        @rest(
          type: "RefreshUserGUIDResponse"
          path: "/RefreshUserGUID"
          method: "GET"
          endpoint: "customerPortal"
        ) {
            status
            NewUserGUID
            UserGUID
            statusdescription
        }
    }
`;

export const testUserGUIDExpire = /*GraphQL*/ `
    mutation testUserGUIDExpire {
        testUserGUIDExpire
        @rest(
          path: "/testUserGUIDExpire"
          method: "GET"
          endpoint: "customerPortal"
        ) {
            status
            statusdescription
        }
    }
`;
