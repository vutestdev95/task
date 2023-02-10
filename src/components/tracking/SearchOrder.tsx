import { css } from "@emotion/css";
import styled from "@emotion/styled";

import { isArray, isEmpty } from "lodash";
import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  headerColumnsAction,
  headerColumnsNoAction,
} from "../../contants/contants";

import {
  ISearchOrderParams,
  useSearchOrder,
} from "../../hooks/apiHooks/useSearchOrder";

import { SVGSearch } from "../../svgs/SVGSearch";
import { EOrderStatus } from "../../types/EOrderStatus";
import { Order, Stop } from "../../types/ISearchOrderRes";
import { formatDate, formatTime } from "../../utils/datetime";
import { isAllPropertyOfObjectIsEmpty } from "../../utils/generals";
import { toastError } from "../../utils/toast";
import { exportUserInfo } from "../../utils/ultils";
import { COLORS } from "../common/Constants";
import { CustomButtonSecondary } from "../common/CustomButton";
import { Loading } from "../common/Loading";
import { Table } from "../common/Table/Table";
import { CheckboxCustom } from "../place-order/stops-section/StopItem/StopItemDetail";
import { DialogAdvancedSearch } from "./DialogAdvancedSearch";

export interface IAdvancedSearchData {
  jobStatus: any;
  serviceType: any;
  packageType: any;
  packageSize: any;
  referenceNumber: string;
  supplierAccountID: string;
  clientCode: string;
  requestorName: string;
  pieceReference: string;
  address: string;
  locationType: any;
  layout: any;
  completed: boolean;
}
export const inititalAdvancedData: IAdvancedSearchData = {
  jobStatus: undefined,
  serviceType: undefined,
  packageType: undefined,
  packageSize: undefined,
  referenceNumber: "",
  supplierAccountID: "",
  clientCode: "",
  requestorName: "",
  pieceReference: "",
  address: "",
  locationType: undefined,
  layout: undefined,
  completed: false,
};

interface SearchOrderProps {
  children?: Element;
  orderNumber: string;
  setOrderNumber: Function;
}

export const getStopArray = (stop: any) => {
  if (isArray(stop)) {
    return stop;
  }
  if (stop) {
    return [stop];
  }
  return [];
};

export const getETA = (listStop: Stop[]) => {
  if (isEmpty(listStop)) {
    return "";
  }
  return listStop[listStop?.length - 1]["@ScheduledDateTime"] || "";
};

export const getDataTable = (orders: (Order | null)[]) => {
  if (!orders.length) {
    return [];
  }
  return orders.map((order) => {
    if (order === null) {
      return {};
    }
    const stop = order?.Stops?.Stop;
    const stops = getStopArray(stop);
    stops.sort((a: any, b: any) => {
      const timeA = new Date(a["@ScheduledDateTime"])?.getTime();
      const timeB = new Date(b["@ScheduledDateTime"])?.getTime();
      return timeA - timeB;
    });
    const firstStop = stops.find(
      (stop: any = {}) => stop["@StopType"] === "P"
      // eslint-disable-next-line no-useless-computed-key
    ) || { ["@ScheduledDateTimeTZ"]: "" };
    const timezone = firstStop["@ScheduledDateTimeTZ"] || "";
    const lastStop = [...stops]
      .reverse()
      .find((stop: any = {}) => stop["@StopType"] === "D") || {
      // eslint-disable-next-line no-useless-computed-key
      ["@ScheduledDateTimeTZ"]: "",
    };
    const timezoneETA = lastStop["@ScheduledDateTimeTZ"] || "";

    return {
      "Order #": order["@OrderID"],
      Status: order["@OrderStatus"],
      Dispatched: order["@DispatchDateTime"],
      "Due by": order["@DueDateTime"],
      ETA: getETA(order?.Stops?.Stop),
      Timezone: timezone,
      TimezoneETA: timezoneETA,
    };
  });
};

const fromAdvancedDataToParams = (
  data: IAdvancedSearchData
): ISearchOrderParams => {
  const params: ISearchOrderParams = {
    OrderNumber: data.referenceNumber,
    Address: data.address,
    CreateUserName: data.requestorName,
    CustomerCode: data.clientCode,
    Layout: data.layout,
    LocationTypeID: data.locationType,
    OrderStatus: data.jobStatus,
    PackageSize: data.packageSize,
    PackageTypeID: data.packageType,
    Reference: data.pieceReference,
    Service: data.serviceType,
    SupplierAccountID: data.supplierAccountID,
    Completed: data.completed,
  };

  return params;
};

const SearchOrder: React.FC<SearchOrderProps> = ({
  orderNumber,
  setOrderNumber,
}) => {
  const [stopName, setStopName] = useState<string>("");

  const [isOpenAdvancedSearch, setIsOpenAdvancedSearch] = useState(false);

  const [advancedData, setAdvancedData] =
    useState<IAdvancedSearchData>(inititalAdvancedData);

  const [params, setParams] = useState<ISearchOrderParams | null>(null);

  const { data, loading, error, refetch } = useSearchOrder(params);
  const isEmptySearchData = useMemo(() => {
    return !data?.searchOrder?.Order;
  }, [data]);

  const updateAdvancedData = useCallback(
    (key: keyof IAdvancedSearchData, value: string) => {
      setAdvancedData((prev) => ({ ...prev, [key]: value }));
    },
    [setAdvancedData]
  );

  const fnCheckActiveRow = useCallback(
    (row: any) => {
      return row["Order #"] === orderNumber;
    },
    [orderNumber]
  );

  const onRowClick = useCallback(
    (orderNumber: string) => {
      setOrderNumber(orderNumber);
    },
    [setOrderNumber]
  );

  const onChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAdvancedData((prev) => ({
        ...prev,
        referenceNumber: e.target.value,
      }));
    },
    [setAdvancedData]
  );

  const onChangeDateRange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStopName(e.target.value);
    },
    [setStopName]
  );

  const onClickAdvancedSearch = useCallback(() => {
    setIsOpenAdvancedSearch(true);
  }, [setIsOpenAdvancedSearch]);

  const onCloseAdvancedSearch = useCallback(() => {
    setIsOpenAdvancedSearch(false);
  }, [setIsOpenAdvancedSearch]);
  const renderSearchResults = () => {
    if (isAllPropertyOfObjectIsEmpty(params) && isEmptySearchData) {
      return (
        <ResultDefaultContainer>
          <div>
            <ImgTruck
              alt="truck"
              src={process.env.PUBLIC_URL + "/images/truck.png"}
            />

            <ResultHere>
              Once you search for an order your results will appear here
            </ResultHere>
          </div>
        </ResultDefaultContainer>
      );
    }
    if (loading) {
      return (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      );
    }
    if (error) {
      return <div>Error</div>;
    }

    if (isEmptySearchData) {
      return (
        <div>
          <NumberOfOrderFound count={0} />
          <Spacer height={40} />

          <NotFoundLabel data-testid="lable-not-found">
            <p>We couldn’t find any order!</p>
            <p>Please change the search parameters</p>
          </NotFoundLabel>
        </div>
      );
    }

    const orders = [data?.searchOrder?.Order];

    const dataTable = getDataTable(orders);

    return (
      <Results
        dataTable={dataTable}
        fnCheckActiveRow={fnCheckActiveRow}
        onRowClick={onRowClick}
        dataOrder={[data?.searchOrder?.Order] || []}
      />
    );
  };

  const updateCompletedOrder = useCallback(
    (event) => {
      updateAdvancedData("completed", event?.target?.checked);
    },
    [updateAdvancedData]
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const newParams = fromAdvancedDataToParams(advancedData);
      if (JSON.stringify(params) === JSON.stringify(newParams)) {
        refetch();
      } else {
        setParams(newParams);
      }
    },
    [advancedData, params, refetch, setParams]
  );

  useEffect(() => {
    const errorMessage = data?.searchOrder?.statusdescription;
    if (errorMessage) {
      toastError(errorMessage);
    }
  }, [data?.searchOrder?.statusdescription]);

  useEffect(() => {
    if (data?.searchOrder?.Order?.["@OrderID"]) {
      return setOrderNumber(data?.searchOrder?.Order?.["@OrderID"]);
    }
    setOrderNumber("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.searchOrder?.Order?.["@OrderID"], setOrderNumber]);

  return (
    <div className=" ">
      <TitlePage data-testid="title-tracking-page">Track Order</TitlePage>

      <SubtitlePage>
        Find your order using the search bar and follow it using the map on the
        right.
      </SubtitlePage>

      <form onSubmit={onSubmit}>
        <InputsContainer>
          <InputWithLabel
            label="Keywords"
            placeholder="What are you looking for?"
            value={advancedData.referenceNumber}
            onChange={onChangeKeyword}
            disabled={false}
          />

          <DivideLine />

          <InputWithLabel
            label="Date Range"
            placeholder="Today"
            value={stopName}
            onChange={onChangeDateRange}
            disabled
          />

          <SubmitButton type="submit" role="submit">
            <SVGSearch />
          </SubmitButton>
        </InputsContainer>
        <div
          className={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <CheckboxCustom
            marginbottom={0}
            marginright={4}
            label="Show completed orders"
            large
            onChange={updateCompletedOrder}
            checked={advancedData.completed}
            data-testid="checkbox_show_completed_order"
          />

          <CustomButtonSecondary
            data-testid="bnt-advanced-search"
            type="button"
            blackOrBlue="blue"
            largeOrSmallText="large"
            text="Advanced Search"
            width="auto"
            onClick={onClickAdvancedSearch}
          />
        </div>
      </form>
      {renderSearchResults()}

      <DialogAdvancedSearch
        setParams={setParams}
        advancedData={advancedData}
        setAdvancedData={setAdvancedData}
        isOpen={isOpenAdvancedSearch}
        onClose={onCloseAdvancedSearch}
      />
    </div>
  );
};

const InputWithLabel = ({
  label,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  disabled: boolean;
}) => {
  return (
    <InputContainer>
      <Label htmlFor="order_number">{label}</Label>

      <StyledInput
        placeholder={placeholder}
        name="order_number"
        id="order_number"
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </InputContainer>
  );
};

const NumberOfOrderFound = ({ count }: { count: number }) => {
  return (
    <NumberOfOrderFoundContainer>
      <img alt="" src={process.env.PUBLIC_URL + "/images/refresh.png"} />
      <OrdersFoundText>
        {count} order{count === 1 ? "" : "s"} found
      </OrdersFoundText>
      <Line />
    </NumberOfOrderFoundContainer>
  );
};

export const ButtonOrderStatus = ({
  status,
}: {
  status: keyof typeof EOrderStatus;
}) => {
  let bgc = "";
  let color = "";
  switch (status) {
    case "N":
      bgc = "rgba(16, 42, 71, 0.1)";
      color = COLORS.DarkestGreyA47;
      break;

    case "A":
    case "I":
    case "P":
      bgc = "#E9F6F0";
      color = COLORS.Green567;
      break;

    case "X":
      bgc = "rgba(255, 129, 78, 0.1)";
      color = "#FF884E";
      break;
  }
  return (
    <StyledButtonOrderStatus
      bgc={bgc}
      color={color}
      data-testid={`button-status`}
    >
      {EOrderStatus[status]}
    </StyledButtonOrderStatus>
  );
};

export const DateAndTime = ({
  date,
  orderNumber,
  type,
  timezone = "",
}: {
  date: string;
  orderNumber: string;
  type: "dispatched" | "due" | "eta";
  timezone?: string;
}) => {
  if (!date) {
    return <div data-testid={`empty-${type}-${orderNumber}`}>-</div>;
  }
  return (
    <div data-testid={`not-empty-${type}-${orderNumber}`}>
      <StyledDate>{formatDate(date)}</StyledDate>
      <StyledTime>
        {formatTime(date)} {timezone || ""}
      </StyledTime>
    </div>
  );
};

export { SearchOrder };

const ResultDefaultContainer = styled.div`
  height: calc(100vh - 263px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100%;
`;

const ImgTruck = styled.img`
  width: 208px;
  height: auto;
  margin-bottom: 24px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const ResultHere = styled.div`
  font-style: italic;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #8da4be;
`;

const NotFoundLabel = styled.div`
  font-style: italic;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #8da4be;
`;

export const TitlePage = styled.div`
  font-size: 30px;
  line-height: 40px;
  text-align: justify;
  color: #102a47;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SubtitlePage = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: #576f8b;
  margin-bottom: 24px;
`;

const InputsContainer = styled.div`
  background: #ffffff;
  border: 1px solid #cbd0df;
  box-shadow: 0px 1px 1px rgba(44, 58, 110, 0.06);
  border-radius: 6px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px;
  margin-bottom: 16px;
`;

const DivideLine = styled.div`
  background: #cfd4df;
  width: 1px;
  height: 40px;
  margin-left: 4px;
  margin-right: 4px;
`;

const SubmitButton = styled.button`
  margin-left: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: #14305a;
  border: 1px solid rgba(0, 0, 0, 0.202387);
  box-shadow: 0px 2px 1px rgba(44, 58, 110, 0.12);
  border-radius: 6px;
`;

const InputContainer = styled.div`
  width: 100%;
  background: #fff;
  &:hover {
    background: #f4f5f7;
  }
  border-radius: 6px;
  padding: 8px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #102a47;
  margin-bottom: 4px;
`;

const StyledInput = styled.input`
  background: transparent;
  width: 100%;
  font-size: 16px;
  line-height: 20px;
  color: #102a47;
  &::placeholder {
    color: #8da4be;
  }
`;

const NumberOfOrderFoundContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 24px;
`;

const OrdersFoundText = styled.p`
  font-size: 16px;
  line-height: 20px;
  text-align: justify;
  color: #000a44;
  margin-left: 9px;
  margin-right: 4px;
`;

const Line = styled.div`
  flex-grow: 1;
  height: 1px;
  background: #cbd0df;
  margin-top: 2px;
`;

export const StyledButtonOrderStatus = styled.span<{
  bgc: string;
  color: string;
}>`
  padding: 4px 8px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  background: ${(props) => props.bgc};
  border-radius: 4px;
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.color};
`;
const StyledDate = styled.div`
  font-size: 15px;
  line-height: 20px;
  text-align: justify;
  color: #102a47;
  margin-bottom: 2px;
`;

const StyledTime = styled.div`
  font-size: 14px;
  line-height: 20px;
  text-align: justify;
  color: #8da4be;
`;

const ExportContainer = styled.div`
  width: 32px;
  height: 32px;
`;

const Spacer = styled.div<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height + "px"};
`;

export const Results = ({
  fnCheckActiveRow,
  onRowClick,
  dataTable,
  dataOrder,
}: {
  fnCheckActiveRow: (row: any) => boolean;
  onRowClick: (orderNumber: string) => void;
  dataTable: any[];
  dataOrder: any[];
}) => {
  function exportFile(orderId: any) {
    return exportUserInfo(dataOrder, orderId);
  }
  const headerColumns = process.env.REACT_APP_DEBUG_MODE
    ? headerColumnsAction
    : headerColumnsNoAction;

  const onClick = (orderId: any) => () => {
    return exportFile(orderId);
  };
  const bodyColumns = process.env.REACT_APP_DEBUG_MODE
    ? [
        {
          renderKey: "Order #",
          render: (order: string) => {
            return (
              <div
                className={css`
                  font-size: 15px;
                  line-height: 20px;
                  text-align: justify;
                  color: #102a47;
                `}
              >
                {order}
              </div>
            );
          },
        },
        {
          renderKey: "Status",
          render: (orderStatus: keyof typeof EOrderStatus) => {
            return <ButtonOrderStatus status={orderStatus} />;
          },
        },
        {
          renderKey: "Dispatched",
          render: (dispatchDate: string, order: any) => {
            return (
              <DateAndTime
                date={dispatchDate}
                orderNumber={order["Order #"]}
                type={"dispatched"}
                timezone={order?.Timezone}
              />
            );
          },
        },
        {
          renderKey: "Due by",
          render: (dueDate: string, order: any) => {
            return (
              <DateAndTime
                orderNumber={order["Order #"]}
                type={"due"}
                date={dueDate}
                timezone={order?.TimezoneETA}
              />
            );
          },
        },
        {
          renderKey: "ETA",
          render: (eta: any, order: any) => {
            return (
              <DateAndTime
                date={eta}
                orderNumber={order["Order #"]}
                type={"eta"}
                timezone={order?.TimezoneETA}
              />
            );
          },
        },
        {
          renderKey: "Export-file",
          render: (_: any, order: any) => {
            return (
              <ExportContainer
                onClick={onClick(order["Order #"])}
                data-testid="export-file"
              >
                <img src="images/export.png" alt="export" />
              </ExportContainer>
            );
          },
        },
      ]
    : [
        {
          renderKey: "Order #",
          render: (order: string) => {
            return (
              <div
                className={css`
                  font-size: 15px;
                  line-height: 20px;
                  text-align: justify;
                  color: #102a47;
                `}
              >
                {order}
              </div>
            );
          },
        },
        {
          renderKey: "Status",
          render: (orderStatus: keyof typeof EOrderStatus) => {
            return <ButtonOrderStatus status={orderStatus} />;
          },
        },
        {
          renderKey: "Dispatched",
          render: (dispatchDate: string, order: any) => {
            return (
              <DateAndTime
                date={dispatchDate}
                orderNumber={order["Order #"]}
                type={"dispatched"}
                timezone={order?.Timezone}
              />
            );
          },
        },
        {
          renderKey: "Due by",
          render: (dueDate: string, order: any) => {
            return (
              <DateAndTime
                orderNumber={order["Order #"]}
                type={"due"}
                date={dueDate}
                timezone={order?.TimezoneETA}
              />
            );
          },
        },
        {
          renderKey: "ETA",
          render: (eta: any, order: any) => {
            return (
              <DateAndTime
                date={eta}
                orderNumber={order["Order #"]}
                type={"eta"}
                timezone={order?.TimezoneETA}
              />
            );
          },
        },
      ];
  return (
    <div>
      <NumberOfOrderFound count={1} />
      <Spacer height={16} />
      <div className=" ">
        <Table
          role="table-search-order"
          fnCheckActiveRow={fnCheckActiveRow}
          onRowClick={onRowClick}
          isLoading={false}
          dataSource={dataTable}
          headerColumns={headerColumns}
          bodyColumns={bodyColumns}
          idKey="Order #"
        />
      </div>
    </div>
  );
};
