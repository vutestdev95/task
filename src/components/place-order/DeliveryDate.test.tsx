import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";
import { DeliveryDate } from "./DeliveryDate";
import PlaceOrderContextProvider from "./PlaceOrderProvider";
import * as myModule from "./useDeliveryDateSectionConfigs";

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const choseFutureDate = ({
  dateInput,
  testDate,
}: {
  dateInput: any;
  testDate: string;
}) => {
  userEvent.click(dateInput);
  userEvent.clear(dateInput);
  userEvent.type(dateInput, testDate);
  userEvent.tab();
};

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

const renderComponent = () => {
  return render(
    <DndProvider backend={TestBackend}>
      <PlaceOrderContextProvider>
        <DeliveryDate />
      </PlaceOrderContextProvider>
    </DndProvider>
  );
};

describe("test-order-ready-by-section", () => {
  let mockedFn: jest.SpyInstance<void>;
  beforeEach(() => {
    mockedFn = jest.spyOn(myModule, "useDeliveryDateSectionConfigs") as any;
  });

  afterEach(() => {
    mockedFn.mockRestore();
  });

  it("Can render title and 2 input fields", () => {
    act(() => {
      renderComponent();
      expect(screen.getByText(/Order Ready By/)).toBeInTheDocument();
      expect(screen.getByText(/Ready by Date/)).toBeInTheDocument();
      expect(screen.getByText("Ready by Time")).toBeInTheDocument();
    });
  });

  it("Date picker can have the default value of current date", async () => {
    await act(async () => {
      renderComponent();
      function formatDate(date: Date) {
        const d = new Date(date);
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
      }

      const currentDateStr = formatDate(new Date());

      await sleep(1);
      expect(screen.getByLabelText(/Ready by Date/i)).toHaveAttribute(
        "value",
        currentDateStr
      );
    });
  });

  it("if ReadyTimeUnassign is false: Time picker can have the default value of current current", async () => {
    mockedFn.mockImplementation(() => {
      return {
        data: {
          ReadyTimeUnassign: false,
        },
        error: undefined,
        loading: false,
      };
    });
    await act(async () => {
      renderComponent();

      const currentTimeStr = format(new Date(), "HH:mm").toUpperCase();

      await sleep(100);
      expect(screen.getByLabelText("Ready by Time")).toHaveAttribute(
        "value",
        currentTimeStr
      );
    });
  });

  it("if ReadyTimeUnassign is true: Time picker can have the default value of empty", async () => {
    mockedFn.mockImplementation(() => {
      return {
        data: {
          ReadyTimeUnassign: true,
        },
        error: undefined,
        loading: false,
      };
    });
    await act(async () => {
      renderComponent();
      await sleep(100);
      expect(screen.getByLabelText("Ready by Time")).toHaveAttribute(
        "value",
        ""
      );
    });
  });

  it("Datepicker: Can chose a future date", async () => {
    await act(async () => {
      renderComponent();
      await sleep(100);
      const dateInput = screen.getByLabelText("Ready by Date");
      const testDate = "2099-11-11";
      choseFutureDate({ dateInput, testDate });
      expect(dateInput).toHaveValue(testDate);
    });
  });

  it("Timepicker: Can chose a future time", async () => {
    await act(async () => {
      renderComponent();
      await sleep(100);

      const dateInput = screen.getByLabelText("Ready by Date");
      const testDate = "2099-11-11";
      choseFutureDate({ dateInput, testDate });

      const testTime = "16:28";

      const timeInput = screen.getByLabelText("Ready by Time");

      userEvent.click(timeInput);

      userEvent.clear(timeInput);

      userEvent.type(timeInput, testTime);

      userEvent.keyboard("{enter}");
      userEvent.tab();

      // assert
      expect(timeInput).toHaveValue(testTime);
    });
  });

  it("Timepicker: Can not chose a past time", async () => {
    await act(async () => {
      renderComponent();
      await sleep(100);

      const testTime = "12:00 AM";

      const timeInput = screen.getByLabelText("Ready by Time");

      userEvent.click(timeInput);

      userEvent.clear(timeInput);

      userEvent.type(timeInput, testTime);
      userEvent.keyboard("{enter}");
      userEvent.tab();
      // assert
      await sleep(300);
      expect(timeInput).not.toHaveValue(testTime);
    });
  });
});
