import { MockedProvider } from "@apollo/client/testing";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";
import { apolloMock } from "../../services/mockdata/apolloMock";
import GetCustomerInfoOutput from "../../services/mockdata/json/GetCustomerInfoOutput.json";
import {
  testChangeCheckbox,
  testChangeInput,
  testChangeSelect,
} from "../../utils/testUtils";
import * as useAuthModule from "../AuthProvider";
import {
  getDataTable,
  getETA,
  getStopArray,
  Results,
  SearchOrder,
} from "./SearchOrder";
const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

const fillFormAndSubmit = async ({ orderNumber }: { orderNumber: string }) => {
  fireEvent.change(screen.getByLabelText("Keywords"), {
    target: { value: orderNumber },
  });
  const submitBnt = await screen.findByRole("submit");
  fireEvent.click(submitBnt);
};

const renderComponent = () => {
  render(
    <MockedProvider mocks={apolloMock()} addTypename={false}>
      <DndProvider backend={TestBackend}>
        <SearchOrder orderNumber="5417" setOrderNumber={jest.fn()} />
      </DndProvider>
    </MockedProvider>
  );
};

describe("test search order component", () => {
  let mockedUseAuth: jest.SpyInstance<void>;
  beforeEach(() => {
    mockedUseAuth = jest.spyOn(useAuthModule, "useAuth") as any;
    mockedUseAuth.mockImplementation(() => {
      return {
        state: { user: GetCustomerInfoOutput },
      };
    });
  });

  afterEach(() => {
    mockedUseAuth.mockRestore();
  });

  it("Can render title", () => {
    act(() => {
      renderComponent();

      expect(screen.getByText("Track Order")).toBeInTheDocument();
      expect(screen.getByTestId("title-tracking-page")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Once you search for an order your results will appear here"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Find your order using the search bar and follow it using the map on the right."
        )
      ).toBeInTheDocument();
    });
  });

  it("Can render input order number and input stop name", () => {
    act(() => {
      renderComponent();

      expect(screen.getByLabelText("Keywords")).toBeInTheDocument();
      expect(screen.getByLabelText("Date Range")).toBeInTheDocument();
    });
  });
  it("Can render checkbox show completed order", async () => {
    await act(async () => {
      renderComponent();

      await testChangeCheckbox("checkbox_show_completed_order");
    });
  });

  it("Can render button submit", () => {
    act(() => {
      renderComponent();

      expect(screen.getByRole("submit")).toBeInTheDocument();
    });
  });

  it("Can render truck image", () => {
    act(() => {
      renderComponent();

      expect(screen.getByAltText("truck")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Once you search for an order your results will appear here"
        )
      ).toBeInTheDocument();
    });
  });

  it("Can search by order number", async () => {
    await act(async () => {
      renderComponent();

      await fillFormAndSubmit({ orderNumber: "5417" });
      expect(await screen.findByRole("table-search-order")).toBeInTheDocument();
    });
  });

  it("Can refetch with the same params", async () => {
    await act(async () => {
      renderComponent();

      await fillFormAndSubmit({ orderNumber: "5417" });
      expect(await screen.findByRole("table-search-order")).toBeInTheDocument();
      await fillFormAndSubmit({ orderNumber: "5417" });
      expect(await screen.findByRole("table-search-order")).toBeInTheDocument();
    });
  });

  it("Can show no order found", async () => {
    await act(async () => {
      renderComponent();

      await fillFormAndSubmit({ orderNumber: "no existed order number" });
      expect(await screen.findByTestId("lable-not-found")).toBeInTheDocument();
    });
  });

  it("Can show status 'new'", async () => {
    await act(async () => {
      renderComponent();

      await fillFormAndSubmit({ orderNumber: "5417" });
      expect(await screen.findByRole("table-search-order")).toBeInTheDocument();
      expect(await screen.findByTestId("button-status")).toContainHTML("New");
      fireEvent.click(await screen.findByTestId("button-status"));
    });
  });

  it("Can show status 'Deleted'", async () => {
    await act(async () => {
      renderComponent();

      await fillFormAndSubmit({ orderNumber: "6789" });
      const table = await screen.findByRole("table-search-order");
      expect(table).toBeInTheDocument();
      expect(table).toContainHTML("Deleted");
    });
  });

  it("Can show status 'Invoiced'", async () => {
    await act(async () => {
      renderComponent();

      await fillFormAndSubmit({ orderNumber: "6786" });
      const table = await screen.findByRole("table-search-order");
      expect(table).toBeInTheDocument();
      expect(table).toContainHTML("Invoiced");
    });
  });

  it("Can status dispatched time, due time", async () => {
    await act(async () => {
      renderComponent();

      await fillFormAndSubmit({ orderNumber: "5417" });
      expect(
        await screen.findByTestId("not-empty-dispatched-5417")
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId("not-empty-due-5417")
      ).toBeInTheDocument();
    });
  });

  it("Can show empty dispatched time, empty due time", async () => {
    await act(async () => {
      renderComponent();

      await fillFormAndSubmit({ orderNumber: "6770" });
      expect(
        await screen.findByTestId(`empty-dispatched-6770`)
      ).toBeInTheDocument();
      expect(await screen.findByTestId(`empty-due-6770`)).toBeInTheDocument();
    });
  });

  it("Can show modal advanced search when click on button", async () => {
    await act(async () => {
      renderComponent();
      const advancedSearchBtn = await screen.findByTestId(
        "bnt-advanced-search"
      );
      fireEvent.click(advancedSearchBtn);

      expect(
        await screen.findByTestId(`title-modal-advanced-search`)
      ).toBeInTheDocument();
    });
  });

  it("Modal advanced search have 12 inputs", async () => {
    await act(async () => {
      renderComponent();
      const advancedSearchBtn = await screen.findByTestId(
        "bnt-advanced-search"
      );
      fireEvent.click(advancedSearchBtn);

      await testChangeSelect({
        dataTestId: "job-status",
        label: "All",
      });

      await testChangeSelect({
        dataTestId: "service-type",
        label: "Direct",
      });

      await testChangeSelect({
        dataTestId: "package-type",
        label: "Pouch",
      });

      await testChangeSelect({
        dataTestId: "package-size",
        label: "Medium",
      });

      await testChangeSelect({
        dataTestId: "location_type",
        label: "Residence",
      });

      await testChangeSelect({
        dataTestId: "layout",
        label: "Dispatch route",
      });

      await testChangeInput("reference_number");
      await testChangeInput("supplier_account_id");
      await testChangeInput("client_code");
      await testChangeInput("requestor_name");
      await testChangeInput("piece_reference");
      await testChangeInput("address");
    });
  });

  it("Can close Modal advanced search", async () => {
    await act(async () => {
      renderComponent();
      const advancedSearchBtn = await screen.findByTestId(
        "bnt-advanced-search"
      );
      fireEvent.click(advancedSearchBtn);

      const resetFilterBtn = await screen.findByTestId("reset_filter_btn");
      expect(resetFilterBtn).toBeInTheDocument();
      fireEvent.click(resetFilterBtn);

      const closeAdvancedSearchBtn = await screen.findByTestId(
        "btn-close-advanced-search-dialog"
      );
      fireEvent.click(closeAdvancedSearchBtn);
      const inputreference_number = await screen.findByTestId(
        "reference_number"
      );
      expect(inputreference_number).toBeInTheDocument();

      userEvent.click(inputreference_number);
      userEvent.clear(inputreference_number);
      userEvent.type(inputreference_number, "AAAAAAAA");

      await sleep(500);
      expect(screen.queryByTestId("title-modal-advanced-search")).toBeNull(); // it doesn't exist
    });
  });
  it("can click on show result button", async () => {
    renderComponent();
    const advancedSearchBtn = await screen.findByTestId("bnt-advanced-search");
    fireEvent.click(advancedSearchBtn);
    fireEvent.click(await screen.findByTestId("btn_show_results"));
    await sleep(500);
    expect(screen.queryByTestId("title-modal-advanced-search")).toBeNull(); // it doesn't exist
  });
});

describe("export file", () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...env }; // Make a copy
  });

  afterAll(() => {
    process.env = env; // Restore old environment
  });

  it("getStopArray", () => {
    expect(getStopArray([])).toStrictEqual([]);
    expect(getStopArray(null)).toStrictEqual([]);
    expect(getStopArray({})).toStrictEqual([{}]);
  });

  it("getETA", () => {
    expect(getETA([])).toStrictEqual("");

    const orderMockData = [
      {
        "@OrderStopID": "11275",
        "@Sequence": "1",
        "@StopType": "P",
        "@ScheduledDateTime": "5/18/2022 12:14:00 PM",
        "@Pieces": "1",
        "@Weight": "0",
        "@TimeOfServiceCode": "WD",
        "@DispatchGroupID": "-1",
        "@StopMiles": "11.1",
        "@ZLatitude": "29.839546",
        "@ZLongitude": "-95.396103",
        "@StopID": "13109",
        "@DispatchZone": "77022",
        "@Name": "Acme Platics",
        "@Address": "330 Acme Ct",
        "@City": "Houston",
        "@State": "TX",
        "@Zip": "77022",
        "@Country": "USA",
        "@Phone": "713-000-0000",
        "@See": "Shipping Clerk",
        "@Room": "Shipping and Receiving",
        "@Note": "Always Check with Clerck",
        "@Latitude": "29.839546",
        "@Longitude": "-95.396103",
        "@LocationTypeID": "1",
        "@AVSQuality": "1",
        "@ScheduledDateTimeTZ": "CST",
        OrderStopPieces: {
          OrderStopPiece: {
            "@OrderStopPieceID": "13729",
            "@PieceID": "6954",
            "@PieceAction": "P",
            "@Sequence": "1",
          },
        },
      },
    ];
    expect(getETA(orderMockData)).toStrictEqual("5/18/2022 12:14:00 PM");
  });

  it("getDataTable", () => {
    expect(getDataTable([])).toStrictEqual([]);
    expect(getDataTable([null])).toStrictEqual([{}]);
  });

  const mockdata = [
    {
      "@UserGUID": "{B873CE79-9D40-41A5-B68F-2BE49AA325D0}",
      "@OrderID": "5417",
      "@SiteID": "4",
      "@SiteCode": "Test3",
      "@OrderNumber": "5417",
      "@OrderStatus": "N",
      "@CustomerID": "26",
      "@CreateDate": "5/18/2022 12:15:00 PM",
      "@CreateDateDate": "05/18/2022",
      "@CreateUserName": "test",
      "@OrderDate": "5/18/2022",
      "@ServiceDesc": "Regular",
      "@AbbrService": "Regular",
      "@Service": "Regular",
      "@VehicleType": "Any",
      "@VehicleTypeID": "1",
      "@Pieces": "1",
      "@Weight": "0",
      "@AmountQuote": "$0.00",
      "@PodName": "test",
      "@PodDateTime": "6/20/2022 9:47:29 PM",
      "@Caller": "test",
      "@CallerPhone": "test",
      "@AmountCharged": "$12.21",
      "@AmountReceived": "$0.00",
      "@PriorityGroup": "0",
      "@AutoVerify": "False",
      "@OrderMainType": "R",
      "@TemplateType": "4",
      "@OrderGUID": "e0fb77ee-6401-40f7-b0fd-b8c86de77ea0",
      "@PackageType": "Pouch",
      "@PackageTypeID": "2",
      "@CarrierTypeID": "1",
      "@HolidayNameID": "0",
      "@DueTimeHolidayNameID": "0",
      "@LastChanged": "6/20/2022 10:47:31 PM",
      "@Origin": "P",
      "@OperationalStatus": "S",
      "@DispatchDateTime": "5/13/2022 10:14:22 AM",
      "@PickedUpDateTime": "5/18/2022 12:17:08 PM",
      "@DeliveredDateTime": "6/20/2022 9:47:29 PM",
      "@PodSign":
        "15972014241428142B142D142F143115341638183C1B421E462049214A214A204A1D4B1A4D184E165015511552155315541556155A175F19651C6C1E732179237F248325862588258B238D21901E921C951998179A159D139F11A010A30EA50DA70CA90BAC0BB00CB40FB912BD15C017C219C31AC31BC01BBB1BB81B",
      "@PodSignType": "Vector",
      "@DimWeightFactor": "0",
      "@TotalMiles": "11.1",
      "@CallerEmail": "test",
      "@BillingTypeID": "0",
      "@DueDateTime": "5/18/2022 3:00:00 PM",
      "@IncludeHolidayNameID": "0",
      "@AmountChargedFlag": "0",
      "@CurrentTime": "11/3/2022 11:18:25 AM",
      "@OrderFileCount": "2",
      Stops: {
        Stop: [
          {
            "@OrderStopID": "11275",
            "@Sequence": "1",
            "@StopType": "P",
            "@ScheduledDateTime": "5/18/2022 12:14:00 PM",
            "@Pieces": "1",
            "@Weight": "0",
            "@TimeOfServiceCode": "WD",
            "@DispatchGroupID": "-1",
            "@StopMiles": "11.1",
            "@ZLatitude": "29.839546",
            "@ZLongitude": "-95.396103",
            "@StopID": "13109",
            "@DispatchZone": "77022",
            "@Name": "Acme Platics",
            "@Address": "330 Acme Ct",
            "@City": "Houston",
            "@State": "TX",
            "@Zip": "77022",
            "@Country": "USA",
            "@Phone": "713-000-0000",
            "@See": "Shipping Clerk",
            "@Room": "Shipping and Receiving",
            "@Note": "Always Check with Clerck",
            "@Latitude": "29.839546",
            "@Longitude": "-95.396103",
            "@LocationTypeID": "1",
            "@AVSQuality": "1",
            "@ScheduledDateTimeTZ": "CST",
            OrderStopPieces: {
              OrderStopPiece: {
                "@OrderStopPieceID": "13729",
                "@PieceID": "6954",
                "@PieceAction": "P",
                "@Sequence": "1",
              },
            },
          },
          {
            "@OrderStopID": "11276",
            "@Sequence": "2",
            "@StopType": "D",
            "@ScheduledDateTime": "5/18/2022 3:14:00 PM",
            "@Pieces": "0",
            "@Weight": "0",
            "@TimeOfServiceCode": "0",
            "@DispatchGroupID": "-1",
            "@ZLatitude": "29.94884",
            "@ZLongitude": "-95.34659",
            "@StopID": "13110",
            "@DispatchZone": "77032",
            "@Name": "Sample Company",
            "@Address": "2700 Greens Rd",
            "@City": "Houston",
            "@State": "TX",
            "@Zip": "77032",
            "@Country": "USA",
            "@Phone": "281-812-3762",
            "@See": "Mail Sprvsr",
            "@Room": "Mail Room",
            "@Note": "See Green Tray, leave Pouch pick up any pkgs or bxs",
            "@Latitude": "29.94884",
            "@Longitude": "-95.34659",
            "@LocationTypeID": "1",
            "@CustomerShipToCode": "SC456",
            "@AVSQuality": "1",
            "@ScheduledDateTimeTZ": "CST",
            OrderStopPieces: {
              OrderStopPiece: {
                "@OrderStopPieceID": "13730",
                "@PieceID": "6954",
                "@PieceAction": "D",
                "@Sequence": "1",
              },
            },
          },
        ],
      },
      OrderFees: {
        OrderFee: [
          {
            "@Sequence": "1",
            "@FeeAmount": "$11.10",
            "@FeeValue": "Zone1=&Zone2=&Mile1=11.1&TotalDistance=11.1&",
            "@OverrideFlag": "False",
            "@SubSequence": "0",
            "@RateID": "489",
            "@RateName": "$1/mile",
            "@RateIDFix": "False",
            "@FeeValueOverrideFlag": "False",
            "@FeeTitle": "Service",
            "@FeeCode": "SV",
          },
          {
            "@Sequence": "11",
            "@FeeAmount": "$1.11",
            "@FeeValue": "10.00",
            "@OverrideFlag": "False",
            "@SubSequence": "0",
            "@RateID": "-1",
            "@RateName": "",
            "@RateIDFix": "False",
            "@FeeValueOverrideFlag": "False",
            "@FeeTitle": "Surcharge",
            "@FeeCode": "SC",
          },
        ],
      },
      Jobs: {
        Job: {
          "@JobID": "5424",
          "@Sequence": "1",
          "@JobNumber": "5471",
          "@JobStatus": "C",
          "@SiteID": "4",
          "@Service": "Regular",
          "@VehicleTypeID": "1",
          "@ManifestDriverID": "1240",
          "@GPSLatitude": "N 30.0152245090645",
          "@GPSLongitude": "W 95.1706732564948",
          "@GPSLastUpdate": "6/23/2022 9:53:18 PM",
          "@SplitPercentage": "50",
          "@JobDate": "5/18/2022",
          "@Pieces": "1",
          "@Weight": "0",
          "@DispatchGroupID": "18",
          "@DeliverySequence": "1",
          "@JobModeID": "1",
          Drivers: {
            Driver: [
              {
                "@Sequence": "1",
                "@DriverID": "1",
                "@DriverCode": "999",
                "@Name": "Test Driver",
                "@Phone": "DC # / Cell # / Home phn # / Misc info",
                "@DriverAlias": "testDriverAlias",
                "@DriverPay": "11.1",
                "@DriverBaseAmount": "11.1",
                "@DriverCommissionPercent": "100",
                "@DriverBaseAmountOverride": "False",
                "@JobDriverID": "2164",
                JobDriverFees: {
                  JobDriverFee: {
                    "@JobDriverFeeID": "1418",
                    "@JobDriverID": "2164",
                    "@Sequence": "1",
                    "@SubSequence": "0",
                    "@FeeAmount": "11.1",
                    "@OverrideFlag": "0",
                    "@PayAmount": "11.1",
                    "@FeePercentFlag": "1",
                    "@UseOrderFee": "1",
                    "@DriverCommissionMultiplier": "1",
                    "@DriverCommissionPercent": "100",
                    "@FlatPay1": "0",
                    "@DriverRateFlagID": "0",
                    "@MethodID": "1",
                    "@FeeTitle": "Service",
                    "@FeeCode": "SV",
                  },
                },
              },
              {
                "@Sequence": "2",
                "@DriverPay": "0",
                "@DriverBaseAmount": "0",
                "@DriverBaseAmountOverride": "False",
              },
            ],
          },
          JobStops: {
            JobStop: [
              {
                "@PodRequired": "False",
                "@JobStopID": "11741",
                "@Sequence": "1",
                "@JobStopStatus": "C",
                "@StopType": "P",
                "@ScheduledDateTime": "5/18/2022 12:14:00 PM",
                "@ArriveDateTime": "5/18/2022 12:17:08 PM",
                "@DepartDateTime": "5/18/2022 12:17:08 PM",
                "@Pieces": "1",
                "@Weight": "0",
                "@PodName": "test",
                "@PodSign":
                  "19AC24232B29312C362F3A2F3D2F412E47294F2355205A1E5C1E5D1E5D1E611F6A217A248A28982BA12DA62EA92EAC2EAE2EAE2EAC2E",
                "@PodSignType": "Vector",
                "@PodDateTime": "5/18/2022 12:17:08 PM",
                "@ProjectedStopDateTime": "5/18/2022 12:39:51 PM",
                "@ArriveDateTimeSource": "Man",
                "@DepartDateTimeSource": "Man",
                "@ManifestDriverID": "1240",
                "@ZLatitude": "29.839546",
                "@ZLongitude": "-95.396103",
                "@StopID": "13109",
                "@DispatchZone": "77022",
                "@Name": "Acme Platics",
                "@Address": "330 Acme Ct",
                "@City": "Houston",
                "@State": "TX",
                "@Zip": "77022",
                "@Country": "USA",
                "@Phone": "713-000-0000",
                "@See": "Shipping Clerk",
                "@Room": "Shipping and Receiving",
                "@Note": "Always Check with Clerck",
                "@Latitude": "29.839546",
                "@Longitude": "-95.396103",
                "@LocationTypeID": "1",
                "@AVSQuality": "1",
                JobStopPieces: {
                  JobStopPiece: {
                    "@JobStopPieceID": "13711",
                    "@PieceID": "6954",
                    "@PieceAction": "P",
                    "@PieceActionStatus": "C",
                    "@ArriveDateTime": "5/18/2022 12:16:11 PM",
                    "@EnteredDateTime": "5/18/2022 12:15:08 PM",
                    "@EnteredUserID": "19",
                    "@EnteredSource": "",
                    "@PieceActionStatusSource": "Scan",
                    "@EnteredUserName": "test",
                    "@Sequence": "1",
                  },
                },
              },
              {
                "@PodRequired": "False",
                "@JobStopID": "11742",
                "@Sequence": "2",
                "@JobStopStatus": "C",
                "@StopType": "D",
                "@ScheduledDateTime": "5/18/2022 3:14:00 PM",
                "@ArriveDateTime": "6/20/2022 9:47:29 PM",
                "@DepartDateTime": "6/20/2022 9:47:29 PM",
                "@Pieces": "0",
                "@Weight": "0",
                "@PodName": "test",
                "@PodSign":
                  "15972014241428142B142D142F143115341638183C1B421E462049214A214A204A1D4B1A4D184E165015511552155315541556155A175F19651C6C1E732179237F248325862588258B238D21901E921C951998179A159D139F11A010A30EA50DA70CA90BAC0BB00CB40FB912BD15C017C219C31AC31BC01BBB1BB81B",
                "@PodSignType": "Vector",
                "@PodDateTime": "6/20/2022 9:47:29 PM",
                "@ProjectedStopDateTime": "6/16/2022 9:52:23 AM",
                "@ArriveDateTimeSource": "Man",
                "@DepartDateTimeSource": "Man",
                "@ManifestDriverID": "1240",
                "@CStopMiles": "11.1",
                "@ZLatitude": "29.94884",
                "@ZLongitude": "-95.34659",
                "@StopID": "13110",
                "@DispatchZone": "77032",
                "@Name": "Sample Company",
                "@Address": "2700 Greens Rd",
                "@City": "Houston",
                "@State": "TX",
                "@Zip": "77032",
                "@Country": "USA",
                "@Phone": "281-812-3762",
                "@See": "Mail Sprvsr",
                "@Room": "Mail Room",
                "@Note": "See Green Tray, leave Pouch pick up any pkgs or bxs",
                "@Latitude": "29.94884",
                "@Longitude": "-95.34659",
                "@LocationTypeID": "1",
                "@CustomerShipToCode": "SC456",
                "@AVSQuality": "1",
                JobStopPieces: {
                  JobStopPiece: {
                    "@JobStopPieceID": "13712",
                    "@PieceID": "6954",
                    "@PieceAction": "D",
                    "@PieceActionStatus": "",
                    "@ArriveDateTime": "",
                    "@EnteredDateTime": "5/18/2022 12:15:08 PM",
                    "@EnteredUserID": "19",
                    "@EnteredSource": "",
                    "@PieceActionStatusSource": "",
                    "@EnteredUserName": "test",
                    "@Sequence": "1",
                  },
                },
              },
            ],
          },
        },
      },
      OrderFrequencies: null,
      OrderNotifies: null,
      OrderFiles: {
        OrderFile: [
          {
            "@OrderFileID": "202",
            "@Description": "JobStop-11741",
            "@ImageTypeID": "2",
            "@FileName": "pod1.jpg",
            "@ContentType": "image/jpeg",
            "@OrderID": "202",
            "@AttachInvoice": "0",
            "@RefType": "JobStop",
            "@RefID": "11741",
            "@Hash": "C9894C2F0F175919EAA2DD775970F8BB",
            "@CreateDateTime": "5/18/2022 1:17:08 PM",
          },
          {
            "@OrderFileID": "207",
            "@Description": "JobStop-11742",
            "@ImageTypeID": "2",
            "@FileName": "pod1.jpg",
            "@ContentType": "image/jpeg",
            "@OrderID": "207",
            "@AttachInvoice": "0",
            "@RefType": "JobStop",
            "@RefID": "11742",
            "@Hash": "D607115D4369FDEC02F13E0B3AACE3DE",
            "@CreateDateTime": "6/20/2022 10:47:29 PM",
          },
        ],
      },
      Site: {
        "@SiteID": "4",
        "@CompanyID": "999",
        "@SiteCode": "Test3",
        "@SiteType": "C",
        "@Name": "Test 3, Inc.",
        "@DBAName": "Test 3, Inc.",
        "@Address": "123 LoneStar Dr",
        "@City": "Houston",
        "@State": "Tx",
        "@Zip": "77002",
        "@Country": "USA",
        "@Phone": "Site Phone Number",
        "@EMail": "buddy@e-courier.com",
        "@Message": "Test site for testing and playing!",
        "@ARAccountNumber": "1200",
        "@ARDeptNumber": "1",
        "@APAccountNumber": "1200",
        "@APDeptNumber": "1",
        "@BankAccountNumber": "5001",
        "@BankDeptNumber": "1",
        "@DispatchNote":
          "Accident at I-10 Sawyer - Add 30 minutes to downtown destinations",
        "@SiteTitle": "Test3",
        "@PaymentGatewayID": "0",
        "@MName": "Test Remit 3",
        "@MAddress": "Remit Address Here",
        "@MCity": "RmtCty",
        "@MState": "Tx",
        "@MZip": "77002",
        "@MCountry": "USA",
        "@MEmail": "buddy@e-courier.com",
        "@LogoImageID": "0",
        "@SiteStatus": "A",
      },
      Customer: {
        "@CustomerID": "26",
        "@CustomerCode": "1991",
        "@Name": "Acme Metals",
        "@Address": "330 Acme Ct",
        "@City": "Houston",
        "@Zip": "77022",
        "@Country": "USA",
        "@Phone": "713-000-0000",
        "@See": "Shipping Clerk",
        "@Room": "Shipping and Receiving",
        "@PName": "Acme Platics",
        "@PAddress": "330 Acme Ct",
        "@PCity": "Houston",
        "@PState": "TX",
        "@PackageTypeID": "0",
        "@PZip": "77022",
        "@PCountry": "USA",
        "@PPhone": "713-000-0000",
        "@PSee": "Shipping Clerk",
        "@PRoom": "Shipping and Receiving",
        "@PNote": "Always Check with Clerck",
        "@PAVSQuality": "-1",
        "@Notes": "notes",
        "@VehicleTypeID": "1",
        "@CreatedDate": "5/4/2018 6:43:42 PM",
        "@Percent2": "5",
        "@SiteID": "4",
        "@CustomerTypeID": "1",
        "@OrderPriorityID": "0",
        "@CustomerGroup": "0",
        "@DriverNotes": "driver notes",
        "@CustomerShipToUpdate": "True",
        "@SetSiteFlag": "1",
        "@AVSCheck": "-1",
        "@CustomerStatus": "A",
        "@SiteCode": "Test3",
        "@CreditStatusID": "1",
        "@OkCreditStatus": "True",
        "@CreditBilling": "1",
        "@ShowSaveCustomerPaymentMethod": "9",
        "@CreditLimit": "1",
        CustomerBillingTypes: {
          "@BillingTypeID": "0",
          "@ShowSaveCustomerPaymentMethod": "9",
          BillingType: {
            "@BillingTypeID": "0",
            "@CreditCardDescription": "BillMe(Invoice)",
            "@PaymentTypeID": "0",
            "@PaymentTypeDescription": "BillMe",
            "@PaymentTenderTypeCode": "X",
            "@WebUserID": "-1",
          },
        },
      },
      Pieces: {
        Piece: {
          "@PieceID": "6954",
          "@Sequence": "1",
          "@PieceStatus": "A",
          "@Reference": "8159457765",
          "@Pieces": "1",
          "@PackageTypeID": "0",
          "@PieceTypeID": "0",
          "@PieceFormatID": "0",
        },
      },
      OrderEvents: {
        OrderEvent: [
          {
            "@OrderEventID": "260515",
            "@EventType": "TaskID",
            "@EventDateTime": "6/20/2022 9:47:31 PM",
            "@UserName": "zMobile",
            "@Note": "C111-HUB TaskID: 110186804",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "260514",
            "@EventType": "GPSAlertSt",
            "@EventDateTime": "6/20/2022 9:47:29 PM",
            "@UserName": "zMobile",
            "@Note":
              "2700 Greens Rd - Lat=30.0152088422167, Long=-95.1707030177191 - StopID:11742",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
          },
          {
            "@OrderEventID": "260513",
            "@EventType": "SaveOrder",
            "@EventDateTime": "6/20/2022 9:47:31 PM",
            "@UserName": "zMobile",
            "@Note":
              "{8465429D-7D98-47CD-8874-61841A35BAD0} 41272 MobileUpdateDataAddOrderEvent 2022-06-20 22:47:31.031 DriverCode=999 Device=iOS!iOS 15.5!Apple!iPhone budtest",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "260512",
            "@EventType": "CheckJobCo",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "",
            "@Note": "Job[1] JobStatus --> C",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "260511",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:DriverRateFlagID:  --> 0",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverRateFlagID",
          },
          {
            "@OrderEventID": "260510",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:MethodID:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.MethodID",
          },
          {
            "@OrderEventID": "260509",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:FlatPay1:  --> $0.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.FlatPay1",
          },
          {
            "@OrderEventID": "260508",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:DriverCommissionPercent:  --> 100",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverCommissionPercent",
          },
          {
            "@OrderEventID": "260507",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:DriverCommissionMultiplier:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverCommissionMultiplier",
          },
          {
            "@OrderEventID": "260506",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:UseOrderFee:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.UseOrderFee",
          },
          {
            "@OrderEventID": "260505",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:FeePercentFlag:  --> 2",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.FeePercentFlag",
          },
          {
            "@OrderEventID": "260504",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:DriverRateFlagID:  --> 0",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverRateFlagID",
          },
          {
            "@OrderEventID": "260503",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:MethodID:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.MethodID",
          },
          {
            "@OrderEventID": "260502",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:FlatPay1:  --> $0.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.FlatPay1",
          },
          {
            "@OrderEventID": "260501",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:DriverCommissionPercent:  --> 100",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverCommissionPercent",
          },
          {
            "@OrderEventID": "260500",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:DriverCommissionMultiplier:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverCommissionMultiplier",
          },
          {
            "@OrderEventID": "260499",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:UseOrderFee:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.UseOrderFee",
          },
          {
            "@OrderEventID": "260498",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:FeePercentFlag:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.FeePercentFlag",
          },
          {
            "@OrderEventID": "260497",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:2:DepartDateTimeSource:  --> Man",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
            "@RefItem": "JobStop.DepartDateTimeSource",
          },
          {
            "@OrderEventID": "260496",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:2:DepartDateTime:  --> 06/20/2022 21:47:29",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
            "@RefItem": "JobStop.DepartDateTime",
          },
          {
            "@OrderEventID": "260495",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:2:ArriveDateTimeSource:  --> Man",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
            "@RefItem": "JobStop.ArriveDateTimeSource",
          },
          {
            "@OrderEventID": "260494",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:2:ArriveDateTime:  --> 06/20/2022 21:47:29",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
            "@RefItem": "JobStop.ArriveDateTime",
          },
          {
            "@OrderEventID": "260493",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:2:PodDateTime:  --> 06/20/2022 21:47:29",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
            "@RefItem": "JobStop.PodDateTime",
          },
          {
            "@OrderEventID": "260492",
            "@EventType": "PodSign",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop: 2 DS: 1",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
          },
          {
            "@OrderEventID": "260491",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:2:PodSign:  -->",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
            "@RefItem": "JobStop.PodSign",
          },
          {
            "@OrderEventID": "260490",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:2:PodName:  --> test",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
            "@RefItem": "JobStop.PodName",
          },
          {
            "@OrderEventID": "260489",
            "@EventType": "StopComple",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop: 2 DS: 1",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
          },
          {
            "@OrderEventID": "260488",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:2:JobStopStatus: A --> C",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
            "@RefItem": "JobStop.JobStopStatus",
          },
          {
            "@OrderEventID": "260487",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "DeliveredDateTime:  --> 6/20/2022 9:47:29 PM",
            "@EventSource": "",
            "@RefType": "OrderMain.OrderID",
            "@RefID": "5471",
            "@RefItem": "OrderMain.DeliveredDateTime",
          },
          {
            "@OrderEventID": "260486",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "PodDateTime:  --> 06/20/2022 21:47:29",
            "@EventSource": "",
            "@RefType": "OrderMain.OrderID",
            "@RefID": "5471",
            "@RefItem": "OrderMain.PodDateTime",
          },
          {
            "@OrderEventID": "260485",
            "@EventType": "Changed",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "PodName:  --> test",
            "@EventSource": "",
            "@RefType": "OrderMain.OrderID",
            "@RefID": "5471",
            "@RefItem": "OrderMain.PodName",
          },
          {
            "@OrderEventID": "260484",
            "@EventType": "Delivered",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "6/20/2022 9:47:29 PM",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "260483",
            "@EventType": "DepartTime",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:2 Sample Company",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
          },
          {
            "@OrderEventID": "260482",
            "@EventType": "ArriveTime",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:2 Sample Company",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
          },
          {
            "@OrderEventID": "260481",
            "@EventType": "SaveOrder",
            "@EventDateTime": "6/20/2022 9:47:30 PM",
            "@UserName": "zMobile",
            "@Note":
              "{8465429D-7D98-47CD-8874-61841A35BAD0} 41272 MobileUpdateDataClearJobStopMultiple 2022-06-20 22:47:30.661 DriverCode=999 Device=iOS!iOS 15.5!Apple!iPhone budtest",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253625",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:DriverRateFlagID:  --> 0",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverRateFlagID",
          },
          {
            "@OrderEventID": "253624",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:MethodID:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.MethodID",
          },
          {
            "@OrderEventID": "253623",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:FlatPay1:  --> $0.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.FlatPay1",
          },
          {
            "@OrderEventID": "253622",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:DriverCommissionPercent:  --> 100",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverCommissionPercent",
          },
          {
            "@OrderEventID": "253621",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:DriverCommissionMultiplier:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverCommissionMultiplier",
          },
          {
            "@OrderEventID": "253620",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:UseOrderFee:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.UseOrderFee",
          },
          {
            "@OrderEventID": "253619",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/3:FeePercentFlag:  --> 2",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.FeePercentFlag",
          },
          {
            "@OrderEventID": "253618",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:DriverRateFlagID:  --> 0",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverRateFlagID",
          },
          {
            "@OrderEventID": "253617",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:MethodID:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.MethodID",
          },
          {
            "@OrderEventID": "253616",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:FlatPay1:  --> $0.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.FlatPay1",
          },
          {
            "@OrderEventID": "253615",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:DriverCommissionPercent:  --> 100",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverCommissionPercent",
          },
          {
            "@OrderEventID": "253614",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:DriverCommissionMultiplier:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.DriverCommissionMultiplier",
          },
          {
            "@OrderEventID": "253613",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:UseOrderFee:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.UseOrderFee",
          },
          {
            "@OrderEventID": "253612",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "JobDriverFee:11/1:FeePercentFlag:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefID": "0",
            "@RefItem": "JobDriverFee.FeePercentFlag",
          },
          {
            "@OrderEventID": "253611",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:2:CStopMiles:  --> 11.1",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
            "@RefItem": "JobStop.CStopMiles",
          },
          {
            "@OrderEventID": "253610",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:1:DepartDateTimeSource:  --> Man",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
            "@RefItem": "JobStop.DepartDateTimeSource",
          },
          {
            "@OrderEventID": "253609",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:1:DepartDateTime:  --> 05/18/2022 12:17:08",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
            "@RefItem": "JobStop.DepartDateTime",
          },
          {
            "@OrderEventID": "253608",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:1:ArriveDateTimeSource:  --> Man",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
            "@RefItem": "JobStop.ArriveDateTimeSource",
          },
          {
            "@OrderEventID": "253607",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:1:ArriveDateTime:  --> 05/18/2022 12:17:08",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
            "@RefItem": "JobStop.ArriveDateTime",
          },
          {
            "@OrderEventID": "253606",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:1:PodDateTime:  --> 05/18/2022 12:17:08",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
            "@RefItem": "JobStop.PodDateTime",
          },
          {
            "@OrderEventID": "253605",
            "@EventType": "PodSign",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop: 1 DS: 1",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
          },
          {
            "@OrderEventID": "253604",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:1:PodSign:  -->",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
            "@RefItem": "JobStop.PodSign",
          },
          {
            "@OrderEventID": "253603",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:1:PodName:  --> test",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
            "@RefItem": "JobStop.PodName",
          },
          {
            "@OrderEventID": "253602",
            "@EventType": "StopComple",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop: 1 DS: 1",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
          },
          {
            "@OrderEventID": "253601",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:1:JobStopStatus: A --> C",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
            "@RefItem": "JobStop.JobStopStatus",
          },
          {
            "@OrderEventID": "253600",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "PickedUpDateTime:  --> 05/18/2022 12:17:08",
            "@EventSource": "",
            "@RefType": "OrderMain.OrderID",
            "@RefID": "5471",
            "@RefItem": "OrderMain.PickedUpDateTime",
          },
          {
            "@OrderEventID": "253599",
            "@EventType": "PickedUp",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "05/18/2022 12:17:08",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
          },
          {
            "@OrderEventID": "253598",
            "@EventType": "DepartTime",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:1 Acme Platics",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
          },
          {
            "@OrderEventID": "253597",
            "@EventType": "ArriveTime",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "Job: 1 Stop:1 Acme Platics",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
          },
          {
            "@OrderEventID": "253596",
            "@EventType": "SaveOrder",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note":
              "{B25D340E-82E4-4E36-AC4D-CA2BF6479236} 55052 MobileUpdateDataClearJobStopMultiple 2022-05-18 13:17:08.709 DriverCode=999 Device=iOS!iOS 15.4.1!Apple!iPhone budtest",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253595",
            "@EventType": "TaskID",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note": "C111-HUB TaskID: 72696955",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253594",
            "@EventType": "GPSAlertSt",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note":
              "330 Acme Ct - Lat=30.0152362474386, Long=-95.170733759961 - StopID:11741",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11741",
          },
          {
            "@OrderEventID": "253593",
            "@EventType": "SaveOrder",
            "@EventDateTime": "5/18/2022 12:17:08 PM",
            "@UserName": "zMobile",
            "@Note":
              "{B25D340E-82E4-4E36-AC4D-CA2BF6479236} 55052 MobileUpdateDataAddOrderEvent 2022-05-18 13:17:08.554 DriverCode=999 Device=iOS!iOS 15.4.1!Apple!iPhone budtest",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253592",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:16:24 PM",
            "@UserName": "zMobile",
            "@Note":
              "JSPiece:Job(1) Stop(1) Piece(1): 8159457765 P:PieceActionStatusSource:  --> Scan",
            "@EventSource": "",
            "@RefType": "JobStopPiece.JobStopPieceID",
            "@RefID": "13711",
            "@RefItem": "JobStopPiece.PieceActionStatusSource",
          },
          {
            "@OrderEventID": "253591",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:16:24 PM",
            "@UserName": "zMobile",
            "@Note":
              "JSPiece:Job(1) Stop(1) Piece(1): 8159457765 P:ArriveDateTime:  --> 05/18/2022 12:16:11",
            "@EventSource": "",
            "@RefType": "JobStopPiece.JobStopPieceID",
            "@RefID": "13711",
            "@RefItem": "JobStopPiece.ArriveDateTime",
          },
          {
            "@OrderEventID": "253590",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:16:24 PM",
            "@UserName": "zMobile",
            "@Note":
              "JSPiece:Job(1) Stop(1) Piece(1): 8159457765 P:PieceActionStatus:  --> C",
            "@EventSource": "",
            "@RefType": "JobStopPiece.JobStopPieceID",
            "@RefID": "13711",
            "@RefItem": "JobStopPiece.PieceActionStatus",
          },
          {
            "@OrderEventID": "253589",
            "@EventType": "UpdatePiec",
            "@EventDateTime": "5/18/2022 12:16:24 PM",
            "@UserName": "zMobile",
            "@Note": "UpdatePieceAll MobileUpdateDataJobStopPieceMultiple",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253588",
            "@EventType": "PieceScan",
            "@EventDateTime": "5/18/2022 12:16:24 PM",
            "@UserName": "zMobile",
            "@Note": "8159457765,P,Acme Platics,05/18/2022 12:16:11",
            "@EventSource": "",
            "@RefType": "JobStopPiece.JobStopPieceID",
            "@RefID": "13711",
          },
          {
            "@OrderEventID": "253587",
            "@EventType": "SaveOrder",
            "@EventDateTime": "5/18/2022 12:16:24 PM",
            "@UserName": "zMobile",
            "@Note":
              "{B25D340E-82E4-4E36-AC4D-CA2BF6479236} 42624 MobileUpdateDataJobStopPieceMultiple 2022-05-18 13:16:24.399 DriverCode=999 Device=iOS!iOS 15.4.1!Apple!iPhone budtest",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253586",
            "@EventType": "DrvToJob",
            "@EventDateTime": "5/18/2022 12:15:26 PM",
            "@UserName": "test",
            "@Note": "AssignDriverToJob DriverID=1 ManifestDriverID=1240",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253584",
            "@EventType": "MobileMess",
            "@EventDateTime": "5/18/2022 12:15:26 PM",
            "@UserName": "",
            "@Note": "New Job: 5471",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253582",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:DriverRateFlagID:  --> 0",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverRateFlagID",
          },
          {
            "@OrderEventID": "253580",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:MethodID:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.MethodID",
          },
          {
            "@OrderEventID": "253578",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:FlatPay1:  --> $0.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.FlatPay1",
          },
          {
            "@OrderEventID": "253576",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:DriverCommissionPercent:  --> 100.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverCommissionPercent",
          },
          {
            "@OrderEventID": "253574",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note":
              "JobDriverFee:11/3:DriverCommissionMultiplier:  --> 1.0000",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverCommissionMultiplier",
          },
          {
            "@OrderEventID": "253572",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:UseOrderFee:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.UseOrderFee",
          },
          {
            "@OrderEventID": "253570",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:FeePercentFlag:  --> 2",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.FeePercentFlag",
          },
          {
            "@OrderEventID": "253568",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:DriverRateFlagID:  --> 0",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverRateFlagID",
          },
          {
            "@OrderEventID": "253566",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:MethodID:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.MethodID",
          },
          {
            "@OrderEventID": "253564",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:FlatPay1:  --> $0.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.FlatPay1",
          },
          {
            "@OrderEventID": "253562",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:DriverCommissionPercent:  --> 100.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverCommissionPercent",
          },
          {
            "@OrderEventID": "253560",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note":
              "JobDriverFee:11/1:DriverCommissionMultiplier:  --> 1.0000",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverCommissionMultiplier",
          },
          {
            "@OrderEventID": "253558",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:UseOrderFee:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.UseOrderFee",
          },
          {
            "@OrderEventID": "253556",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:FeePercentFlag:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.FeePercentFlag",
          },
          {
            "@OrderEventID": "253554",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note":
              "JSPiece:Job(1) Stop(2) Piece(1): 8159457765 D:PieceAction: D --> D",
            "@EventSource": "",
            "@RefType": "JobStopPiece.JobStopPieceID",
            "@RefID": "13712",
            "@RefItem": "JobStopPiece.PieceAction",
          },
          {
            "@OrderEventID": "253552",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "Job: 1 Stop:2:CStopMiles:  --> 11.1",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
            "@RefItem": "JobStop.CStopMiles",
          },
          {
            "@OrderEventID": "253550",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note":
              "JSPiece:Job(1) Stop(1) Piece(1): 8159457765 P:PieceAction: P --> P",
            "@EventSource": "",
            "@RefType": "JobStopPiece.JobStopPieceID",
            "@RefID": "13711",
            "@RefItem": "JobStopPiece.PieceAction",
          },
          {
            "@OrderEventID": "253548",
            "@EventType": "Dispatch",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note":
              "Driver: 999 Manifest: 1240 Job[1] JobStatus N --> A DriverPay=True",
            "@EventSource": "",
            "@RefType": "Job.JobID",
            "@RefID": "5424",
          },
          {
            "@OrderEventID": "253546",
            "@EventType": "SaveOrder",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note":
              "{B6184E64-E079-4195-AD44-8745D338837F} 3344 AssignJobToDriverManifest 05/18/22 13:15:25.275 budtest",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253544",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:DriverRateFlagID:  --> 0",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverRateFlagID",
          },
          {
            "@OrderEventID": "253542",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:MethodID:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.MethodID",
          },
          {
            "@OrderEventID": "253540",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:FlatPay1:  --> $0.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.FlatPay1",
          },
          {
            "@OrderEventID": "253538",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:DriverCommissionPercent:  --> 100.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverCommissionPercent",
          },
          {
            "@OrderEventID": "253536",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note":
              "JobDriverFee:11/3:DriverCommissionMultiplier:  --> 1.0000",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverCommissionMultiplier",
          },
          {
            "@OrderEventID": "253534",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:UseOrderFee:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.UseOrderFee",
          },
          {
            "@OrderEventID": "253532",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/3:FeePercentFlag:  --> 2",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.FeePercentFlag",
          },
          {
            "@OrderEventID": "253530",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:DriverRateFlagID:  --> 0",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverRateFlagID",
          },
          {
            "@OrderEventID": "253528",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:MethodID:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.MethodID",
          },
          {
            "@OrderEventID": "253526",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:FlatPay1:  --> $0.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.FlatPay1",
          },
          {
            "@OrderEventID": "253524",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:DriverCommissionPercent:  --> 100.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverCommissionPercent",
          },
          {
            "@OrderEventID": "253522",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note":
              "JobDriverFee:11/1:DriverCommissionMultiplier:  --> 1.0000",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverCommissionMultiplier",
          },
          {
            "@OrderEventID": "253520",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:UseOrderFee:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.UseOrderFee",
          },
          {
            "@OrderEventID": "253518",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:11/1:FeePercentFlag:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.FeePercentFlag",
          },
          {
            "@OrderEventID": "253516",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:1/0:DriverRateFlagID:  --> 0",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverRateFlagID",
          },
          {
            "@OrderEventID": "253514",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:1/0:MethodID:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.MethodID",
          },
          {
            "@OrderEventID": "253512",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:1/0:FlatPay1:  --> $0.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.FlatPay1",
          },
          {
            "@OrderEventID": "253510",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:1/0:DriverCommissionPercent:  --> 100.00",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverCommissionPercent",
          },
          {
            "@OrderEventID": "253508",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:1/0:DriverCommissionMultiplier:  --> 1.0000",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.DriverCommissionMultiplier",
          },
          {
            "@OrderEventID": "253506",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:1/0:UseOrderFee:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.UseOrderFee",
          },
          {
            "@OrderEventID": "253504",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:1/0:FeePercentFlag:  --> 1",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.FeePercentFlag",
          },
          {
            "@OrderEventID": "253502",
            "@EventType": "FeeChange",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:1/0:PayAmount:  --> $11.10",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.PayAmount",
          },
          {
            "@OrderEventID": "253500",
            "@EventType": "FeeChange",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "JobDriverFee:1/0:FeeAmount:  --> $11.10",
            "@EventSource": "",
            "@RefType": "JobDriverFee.JobDriverFeeID",
            "@RefItem": "JobDriverFee.FeeAmount",
          },
          {
            "@OrderEventID": "253498",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note":
              "JSPiece:Job(1) Stop(2) Piece(1): 8159457765 D:PieceAction: D --> D",
            "@EventSource": "",
            "@RefType": "JobStopPiece.JobStopPieceID",
            "@RefID": "13712",
            "@RefItem": "JobStopPiece.PieceAction",
          },
          {
            "@OrderEventID": "253496",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "Job: 1 Stop:2:CStopMiles:  --> 0",
            "@EventSource": "",
            "@RefType": "JobStop.JobStopID",
            "@RefID": "11742",
            "@RefItem": "JobStop.CStopMiles",
          },
          {
            "@OrderEventID": "253494",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note":
              "JSPiece:Job(1) Stop(1) Piece(1): 8159457765 P:PieceAction: P --> P",
            "@EventSource": "",
            "@RefType": "JobStopPiece.JobStopPieceID",
            "@RefID": "13711",
            "@RefItem": "JobStopPiece.PieceAction",
          },
          {
            "@OrderEventID": "253492",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "Job: 1 Driver:1:DriverPay:  --> 11.1",
            "@EventSource": "",
            "@RefType": "JobDriver.JobDriverID",
            "@RefID": "2164",
            "@RefItem": "JobDriver.DriverPay",
          },
          {
            "@OrderEventID": "253490",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "Job: 1 Driver:1:DriverCommissionPercent:  --> 100.00",
            "@EventSource": "",
            "@RefType": "JobDriver.JobDriverID",
            "@RefID": "2164",
            "@RefItem": "JobDriver.DriverCommissionPercent",
          },
          {
            "@OrderEventID": "253488",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "Job: 1 Driver:1:DriverCode:  --> 999",
            "@EventSource": "",
            "@RefType": "JobDriver.JobDriverID",
            "@RefID": "2164",
            "@RefItem": "JobDriver.DriverCode",
          },
          {
            "@OrderEventID": "253486",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "Job: 1 Driver:1:DriverRevenueAmount:  --> 12.21",
            "@EventSource": "",
            "@RefType": "JobDriver.JobDriverID",
            "@RefID": "2164",
            "@RefItem": "JobDriver.DriverRevenueAmount",
          },
          {
            "@OrderEventID": "253484",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "Job: 1 Driver:1:DriverBaseAmountOverride:  --> False",
            "@EventSource": "",
            "@RefType": "JobDriver.JobDriverID",
            "@RefID": "2164",
            "@RefItem": "JobDriver.DriverBaseAmountOverride",
          },
          {
            "@OrderEventID": "253482",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "Job: 1 Driver:1:DriverBaseAmount:  --> 11.10",
            "@EventSource": "",
            "@RefType": "JobDriver.JobDriverID",
            "@RefID": "2164",
            "@RefItem": "JobDriver.DriverBaseAmount",
          },
          {
            "@OrderEventID": "253480",
            "@EventType": "Changed",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "Add JobDriver Job: 1 Sequence: 1",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253478",
            "@EventType": "ChangeOps",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note": "",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253476",
            "@EventType": "SaveOrder",
            "@EventDateTime": "5/18/2022 12:15:25 PM",
            "@UserName": "test",
            "@Note":
              "{B6184E64-E079-4195-AD44-8745D338837F} 3344 orderscreen.cshtml,SaveData 05/18/22 13:15:23.806 budtest",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253474",
            "@EventType": "New",
            "@EventDateTime": "5/18/2022 12:15:08 PM",
            "@UserName": "test",
            "@Note": "",
            "@EventSource": "",
          },
          {
            "@OrderEventID": "253472",
            "@EventType": "SaveOrder",
            "@EventDateTime": "5/18/2022 12:15:08 PM",
            "@UserName": "test",
            "@Note":
              "{B6184E64-E079-4195-AD44-8745D338837F} 4608 orderscreen.cshtml,SaveData 05/18/22 13:15:06.577 budtest",
            "@EventSource": "",
          },
        ],
      },
    },
  ];

  it("can export file csv", async () => {
    process.env.REACT_APP_DEBUG_MODE = "true";

    render(
      <MockedProvider mocks={apolloMock()} addTypename={false}>
        <DndProvider backend={TestBackend}>
          <Results
            fnCheckActiveRow={jest.fn()}
            onRowClick={jest.fn()}
            dataTable={mockdata}
            dataOrder={mockdata || []}
          />
        </DndProvider>
      </MockedProvider>
    );

    const btnExport = await screen.findByTestId("export-file");
    userEvent.click(btnExport);

    expect(btnExport).toBeVisible();
  });
});
