import { isEmpty } from "lodash";
import { useSearchOrderQuery } from "../../generated/graphql";
import { ISearchOrderRes } from "../../types/ISearchOrderRes";
import { processObject } from "../../utils/generals";

export interface ISearchOrderParams {
  OrderNumber?: string;
  Address?: string;
  CreateUserName?: string;
  CustomerCode?: string;
  Layout?: string;
  LocationTypeID?: string;
  OrderStatus?: string;
  PackageSize?: string;
  PackageTypeID?: string;
  Reference?: string;
  Service?: string;
  SupplierAccountID?: string;
  Completed?: boolean;
}

// {
//   OrderNumber: orderNumberSearch,
//   Address: advancedData.address,
//   CreateUserName: advancedData.requestorName,
//   CustomerCode: advancedData.clientCode,
//   Layout: advancedData.layout,
//   LocationTypeID: advancedData.locationType,
//   OrderStatus: advancedData.jobStatus,
//   PackageSize: advancedData.packageSize,
//   PackageTypeID: advancedData.packageType,
//   Reference: advancedData.pieceReference,
//   Service: advancedData.serviceType,
//   SupplierAccountID: advancedData.supplierAccountID,
//   Completed: advancedData.completed,
// }

export const useSearchOrder = (params: ISearchOrderParams | null) => {
  const processParams = processObject({
    listKeyToConvertToNumber: [],
    obj: params!,
  });
  const result = useSearchOrderQuery({
    variables: {
      input: processParams,
    },
    skip: !params || isEmpty(processParams),
    fetchPolicy: "no-cache",
  });

  const { error, loading, refetch } = result;
  const { data } = result as unknown as { data: ISearchOrderRes };
  return { data, loading, error, refetch };
};
