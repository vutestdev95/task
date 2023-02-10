import { render } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { apolloMock } from "../../services/mockdata/apolloMock";
import Detail, { DetailRef } from "./Detail";
import { useEffect, useRef } from "react";

it("Can render component", () => {
  renderComponent();
});

export const renderComponent = () => {
  render(<Component />);
};

const Component = () => {
  const ref = useRef<DetailRef>(null);

  useEffect(() => {
    ref.current?.open("6789");
  }, []);

  return (
    <MockedProvider mocks={apolloMock()} addTypename={false}>
      <Detail orderNumber="6770" setOrderNumber={jest.fn} ref={ref} />
    </MockedProvider>
  );
};
