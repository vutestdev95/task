import { act, render, screen } from "@testing-library/react";
import * as useIsMobileModule from "./../../hooks/useIsMobile";
import { DialogAdvancedSearch } from "./DialogAdvancedSearch";
import { inititalAdvancedData } from "./SearchOrder";

describe("test-dialog-advanced-search", () => {
  let mockedUseIsMobile: jest.SpyInstance<void>;
  beforeEach(() => {
    mockedUseIsMobile = jest.spyOn(useIsMobileModule, "useIsMobile") as any;
  });

  afterEach(() => {
    mockedUseIsMobile.mockRestore();
  });

  it("Button back not show in desktop version", () => {
    mockedUseIsMobile.mockImplementation(() => {
      return false;
    });

    act(() => {
      render(
        <DialogAdvancedSearch
          onClose={undefined}
          isOpen={true}
          setParams={undefined}
          advancedData={inititalAdvancedData}
          setAdvancedData={undefined}
        />
      );

      expect(screen.queryByTestId("btn-back")).not.toBeInTheDocument();
    });
  });

  it("button back show in mobile version", async () => {
    mockedUseIsMobile.mockImplementation(() => {
      return true;
    });

    await act(async () => {
      render(
        <DialogAdvancedSearch
          isOpen={true}
          advancedData={inititalAdvancedData}
        />
      );

      expect(await screen.findByTestId("btn-back")).toBeInTheDocument();
    });
  });
});
