export const getEzShip = /*GraphQL*/ `
    mutation getEzShip($input: EzShipInput!) {
        getEzShip(input: $input)
        @rest(
          path: "/GetEZShip"
          method: "POST"
        ) {
          EZShipId
          __typename
        }
    }
`;
