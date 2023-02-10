import { Icon, Radio, Spinner } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import styled from "@emotion/styled";
import { Col, Row, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { format, startOfDay } from "date-fns";
import { groupBy, isArray, isEmpty } from "lodash";
import {
  FunctionComponent,
  memo,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useHistory } from "react-router-dom";
import { useGetQuoteOrderMutation } from "../../../generated/graphql";
import { uuidv4, valuesToInputPlaceOrderStops } from "../../../utils/generals";
import { useAuth } from "../../AuthProvider";
import { Constants } from "../../common/Constants";
import { usePlaceOrder } from "../PlaceOrderProvider";

const { ROUTES } = Constants;

interface QuoteProps {
  values: any;
}

const Container = styled.div`
  width: 100%;
  padding: 26px 24px;
  border-radius: 6px;
  box-shadow: 0 2px 1px 0 rgba(44, 58, 110, 0.06);
  border: solid 1px #cbd0df;
  background-color: #fff;
`;

const Title = styled.span`
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #102a47;
`;

const ReadyByText = styled.p`
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: justify;
  color: #000a44;
  margin-top: 24px;
`;

const TableQuote = styled(Table)`
  margin-top: 24px;

  .bp4-control.bp4-radio {
    margin-bottom: 0;
  }

  .bp4-control input:checked ~ .bp4-control-indicator {
    background-color: #102a47;
  }

  thead {
    th {
      background: white;
      border: none;

      &:before {
        content: none !important;
      }
    }
  }

  .ant-table-tbody > tr > td {
    background: #fff;
  }

  tbody {
    tr {
      border-radius: 6px;
      padding: 10px 8px;
      cursor: pointer;
    }

    td {
      background: white;
      border: none;
      padding: 10px 8px;
    }

    .ant-table-row-selected {
      background: #f4f5f7;
    }
  }

  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: rgba(255, 255, 255, 0);
  }

  .group-row {
    td {
      &:first-of-type {
        display: none;
      }
    }
  }

  .ant-spin-dot {
    display: flex;
  }
`;

const HeaderText = styled.p`
  display: inline;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: justify;
  color: #000a44;
  cursor: pointer;
`;

const RowText = styled.p`
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: justify;
  color: #000a44;

  > .bold {
    color: #14305a;
    font-weight: 500;
  }
`;

const QuoteResponsive = styled.div`
  margin-top: -10px;
`;

const QuoteResponsiveItemContainer = styled.div`
  margin-top: 16px;
  padding-bottom: 18px;
  position: relative;

  &:after {
    content: "";
    width: calc(100% + 48px);
    position: absolute;
    border-bottom: solid 1px #cbd0df;
    left: -24px;
    bottom: 0;
  }

  &:last-child {
    padding-bottom: 0;
    &:after {
      border-bottom: none;
    }
  }
`;

const QuoteResponsiveItemWrapper = styled.div``;

export const QuoteResponsiveItem = ({
  item,
  selected = false,
  setSelectedKey,
}: {
  item: any;
  selected: any;
  setSelectedKey: any;
}) => {
  const onSelect = useCallback(
    () => setSelectedKey(item),
    [setSelectedKey, item]
  );
  return (
    <QuoteResponsiveItemContainer
      onClick={onSelect}
      data-testid="quote-order-service-item"
    >
      <QuoteResponsiveItemWrapper>
        <Row>
          <Col>
            <Radio checked={selected} readOnly />
          </Col>
          <Col>
            <HeaderText>Rate {item["@AmountCharged"]}</HeaderText>
            <div>
              <HeaderText style={{ display: "inline" }}>Deliver by </HeaderText>
              <RowText style={{ display: "inline" }}>
                {format(new Date(item["@ReadyDateTime"]), "hh:mm aa")}
              </RowText>
            </div>
            <HeaderText>Service {item["@Description"]}</HeaderText>
          </Col>
        </Row>
      </QuoteResponsiveItemWrapper>
    </QuoteResponsiveItemContainer>
  );
};

const columns: ColumnsType<any> = [
  {
    title: () => (
      <div>
        <HeaderText>Deliver by</HeaderText>
        <Icon icon={IconNames.CaretDown} />
      </div>
    ),
    dataIndex: "@ReadyDateTime",
    key: "ReadyDateTime",
    render(value, record) {
      return record.parent ? (
        <HeaderText>{format(new Date(Number(value)), "iii MMM dd")}</HeaderText>
      ) : (
        <RowText>{format(new Date(value), "hh:mm aa")}</RowText>
      );
    },
    onCell: (record) => ({
      colSpan: record.parent ? 5 : 1,
    }),
  },
  {
    title: () => <HeaderText>Service</HeaderText>,
    key: "Service",
    dataIndex: "@Service",
    render(_value, record) {
      return record.parent ? null : <RowText>{record["@Description"]}</RowText>;
    },
    onCell: (record) => ({
      colSpan: record.parent ? 0 : 1,
    }),
  },
  {
    title: () => <HeaderText>Rate</HeaderText>,
    key: "AmountCharged",
    dataIndex: "@AmountCharged",
    render(value, record) {
      return record.parent ? null : (
        <RowText className="bold" style={{ color: "#14305a", fontWeight: 500 }}>
          {value}
        </RowText>
      );
    },
    onCell: (record) => ({
      colSpan: record.parent ? 0 : 1,
    }),
  },
  {
    title: () => <HeaderText>Carrier</HeaderText>,
    key: "DriverCode",
    dataIndex: "@DriverCode",
    render(value, record) {
      return record.parent ? null : <RowText>{value}</RowText>;
    },
    onCell: (record) => ({
      colSpan: record.parent ? 0 : 1,
    }),
  },
];

const Quote: FunctionComponent<QuoteProps> = ({ values = {} }) => {
  const history = useHistory();
  const [selectedKey, setSelectedKey] = useState<any | null>(null);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [queryQuote, { data: dataQuote, loading: getQuoteLoading, error }] =
    useGetQuoteOrderMutation();
  const { setValue } = usePlaceOrder().formState;
  const { user } = useAuth()?.state;

  useEffect(() => {
    if (!values) return;
    const stops = valuesToInputPlaceOrderStops(values);
    if (!values.forward) {
      history && history.push(ROUTES.placeOrder);
      return;
    }
    queryQuote({
      variables: {
        input: {
          Order: {
            CustomerCode: user?.CustomerID,
            Service: values.deliveryServiceType,
            Auth: user?.CustomerID,
            Weight: values.weight,
            Pieces: values.pieces,
            Stops: {
              Stop: stops,
            },
          },
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (isEmpty(dataQuote?.GetQuoteOrder?.mQuoteOrderResponse?.Order)) return;
    const data = isArray(dataQuote?.GetQuoteOrder?.mQuoteOrderResponse?.Order)
      ? dataQuote?.GetQuoteOrder?.mQuoteOrderResponse?.Order
      : [dataQuote?.GetQuoteOrder?.mQuoteOrderResponse?.Order];
    const dataObj = groupBy(
      data.map((value: any) => ({
        ...value,
        _id: uuidv4(),
      })),
      (value) => startOfDay(new Date(value["@ReadyDateTime"])).getTime()
    );
    const newData: any[] = [];
    Object.keys(dataObj).forEach((key) => {
      newData.push({
        // eslint-disable-next-line no-useless-computed-key
        ["@ReadyDateTime"]: key,
        parent: true,
        _id: uuidv4(),
      });
      newData.push(...dataObj[key]);
    });
    setDataSource(newData);
  }, [dataQuote]);

  useEffect(() => {
    if (!error) return;
    history.push(ROUTES.placeOrder);
  }, [error, history]);

  useEffect(() => {
    if (!selectedKey) return;
    setValue("quoteService", selectedKey);
  }, [selectedKey, setValue]);

  const readyTime = useMemo(
    () =>
      values?.delivery_date
        ? format(values.delivery_date as Date, "iiii MMMM dd, yyyy")
        : "",
    [values?.delivery_date]
  );

  const renderCellRadio = useCallback((value: any, record: any) => {
    if (record?.parent) return null;
    return (
      <RadioComponent
        value={value}
        setSelectedKey={setSelectedKey}
        record={record}
      />
    );
  }, []);

  const onRow = useCallback(
    (record: any) => {
      if (record?.parent)
        return {
          className: "group-row",
          "data-testid": "quote-row",
        };
      return {
        onClick: () => setSelectedKey(record),
        "data-testid": "quote-row",
      };
    },
    [setSelectedKey]
  );

  return (
    <Container data-testid="quote-order">
      <Row gutter={[0, 0]}>
        <Col xs={0} sm={24}>
          <Title>Quote</Title>
          <ReadyByText>Ready by {readyTime}</ReadyByText>
          <TableQuote
            dataSource={dataSource}
            columns={columns}
            rowSelection={{
              type: "radio",
              renderCell: renderCellRadio,
              selectedRowKeys: selectedKey?._id ? [`${selectedKey?._id}`] : [],
            }}
            rowKey="_id"
            pagination={false}
            onRow={onRow}
            loading={{
              spinning: getQuoteLoading,
              indicator: <Spinner />,
            }}
            locale={{
              emptyText: "",
            }}
          />
        </Col>
        <Col sm={0} xs={24}>
          <QuoteResponsive>
            <ReadyByText style={{ marginTop: 0 }}>
              Ready by {readyTime}
            </ReadyByText>
            {getQuoteLoading && <Spinner size={32} />}
            {dataSource.map((item: any) =>
              !item?.parent ? (
                <QuoteResponsiveItem
                  setSelectedKey={setSelectedKey}
                  item={item}
                  key={item?._id}
                  selected={
                    selectedKey?._id ? selectedKey?._id === item?._id : false
                  }
                />
              ) : (
                <HeaderText key={item?._id}>
                  {format(
                    new Date(Number(item["@ReadyDateTime"])),
                    "iii MMM dd"
                  )}
                </HeaderText>
              )
            )}
          </QuoteResponsive>
        </Col>
      </Row>
    </Container>
  );
};

export default memo(Quote);

const RadioComponent = ({
  value,
  setSelectedKey,
  record,
}: {
  value: any;
  setSelectedKey: any;
  record: any;
}) => {
  const onClick = useCallback(
    () => setSelectedKey(record),
    [setSelectedKey, record]
  );
  return (
    <Radio
      checked={value}
      onClick={onClick}
      onChange={undefined}
      readOnly
      large
      style={{ display: "flex", justifyContent: "center" }}
    />
  );
};
