export const searchOrder = /*GraphQL*/ `
    query SearchOrder($input: SearchOrderInput!) {
        searchOrder(input: $input)
        @rest(
          type: "SearchOrderResponse"
          path: "/GetJsonOrder"
          method: "POST"
        ) {
            Order
            statusdescription
            status
        }
    }
`;
