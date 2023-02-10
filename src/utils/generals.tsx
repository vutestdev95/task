import { chain, isArray, isEmpty, isNumber } from "lodash";
import { v1 } from "uuid";
import { format, getDate, getMonth, getYear, set } from "date-fns";

export const fromEnumToOptions = (enumObject: any) => {
  return Object.entries(enumObject).map((data) => {
    const [key, value] = data as [string, string];
    return {
      label: key,
      value,
    };
  });
};

export const uuidv4 = () => {
  return v1();
};

export const equalStr = (str1: string, str2: string) => {
  return str1.toLowerCase() === str2.toLowerCase();
};

export const clsDefaultSVG = "cursor-pointer hover:bg-[#ecf0ff] rounded-[6px]";

export const getArrayFromField = (values: any) => {
  if (isArray(values)) return values;
  if (isNumber(values)) return [values];
  if (isEmpty(values)) return [];
  return [values];
};
export const isAllPropertyOfObjectIsEmpty = (obj: object | null) => {
  if (!obj) return true;
  return Object.values(obj).every((x) => {
    if (isNumber(x)) {
      return x === 0;
    }
    return x === "" || x === undefined;
  });
};

export const processObject = ({
  obj,
  listKeyToConvertToNumber,
}: {
  obj: object;
  listKeyToConvertToNumber: string[];
}) => {
  return chain(obj)
    .pickBy((value) => {
      return value !== "" && value !== undefined;
    })
    .mapValues((value, key) => {
      if (listKeyToConvertToNumber.includes(key)) {
        return Number(value) || 0;
      }
      return value;
    })
    .value();
};

export const valuesToInputPlaceOrderStops = (values: any) => {
  const { delivery_date, delivery_time } = values;
  const date = set(delivery_time, {
    year: getYear(delivery_date),
    month: getMonth(delivery_date),
    date: getDate(delivery_date),
  });
  const stops = (values?.stops || []).map((stop: any, index: number) => {
    return {
      Sequence: `${index + 1}`,
      StopType: stop.StopType,
      ...(stop.StopType === "P"
        ? {
            ScheduledDateTime: format(date, "MM/dd/yyyy h:mm:ss b"),
          }
        : {}),
      Name: stop.Name,
      Address: stop.Address,
      City: stop.City,
      State: stop.State,
      Zip: stop.Zip,
      Country: "USA",
      Phone: stop.Phone,
      OrderStopPieces: {
        OrderStopPiece: {
          PieceAction: stop.StopType,
          Sequence: "1",
        },
      },
    };
  });
  return stops;
};
