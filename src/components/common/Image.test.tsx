import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Image from "./Image";

it("Can render component", async () => {
  await renderComponent();
});

it("Can open preview image", async () => {
  await renderComponent();
  const component = await screen.findByTestId("image-component");
  userEvent.click(component);
  const close = await screen.findByTestId("close-preview-image-component");
  userEvent.click(close);
});

const renderComponent = async () => {
  render(
    <Image src="https://s3-alpha-sig.figma.com/img/e60c/2870/7b55caf2d95b9f812f711db24ee5da73?Expires=1672012800&Signature=lcioo43FIsKImdQsXbiX8ePCT1Fr0U4x4GWpSTEwxO6Qh6diohQG~389ZbQgSBfpFe18i4JO4a9D2-tGq7b-9TT0YLaL71TRVqauSSr2uIN~zWweaLCqLnJA0iLP4GgPDczCQU307lDZ6O3sNudsX5ez2svbs0eTpxb3GwftsmjgqquHsBdPE-J9h2tuuKS4JZfd5VI6C6Xj9eIrToWWe2M1JPumplEhP1oueI-5Exqeu6BVTI6Pzobq8Y73DQ40mQMRA8E-Qdk34psUs4Y2Da1tuKUjWuXJsc0e39G6qtHTe3otGCUx6J1-pO28jilxImY9zuKn4NKM4t9peL2bfw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4" />
  );
  const component = await screen.findByTestId("image-component");
  expect(component).toBeInTheDocument();
  return component;
};
