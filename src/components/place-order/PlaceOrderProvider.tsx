import { createContext, useCallback, useContext, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useAuth } from "../AuthProvider";

export type IFormPlaceOrder = {
  delivery_date: Date | null;
  delivery_time: Date | null;
  cashondelivery: boolean;
  references: any[];
  quoteService: any;
  stops: {
    StopType?: any;
    Address?: string;
    Building?: string;
    City?: string;
    Email?: string;
    Name?: string;
    Notes?: string;
    Phone?: string;
    SaveAddress?: boolean;
    State?: string;
    Zip?: string;
    edit?: any;
    Residence?: boolean;
    disableRemove?: any;
  }[];
  required?: boolean;
  [key: string]: any;
};

interface PlaceOrderContextType {
  formState: UseFormReturn<IFormPlaceOrder, any>;
}

const PlaceOrderContext = createContext<PlaceOrderContextType>({} as any);

export const usePlaceOrder = () => {
  const state = useContext(PlaceOrderContext);

  const validate = useCallback(async () => {
    const err = await state.formState.trigger();
    return err as any;
  }, [state.formState]);

  return {
    ...state,
    validate,
  };
};

const PlaceOrderContextProvider = ({ children }: any) => {
  const { user } = useAuth().state;
  const stopsDefault = [
    {
      StopType: "P",
      edit: true,
      disableRemove: true,
      Address: user?.PAddress,
      Building: user?.PRoom,
      City: user?.PCity,
      Name: user?.PName,
      Notes: user?.PNote,
      Phone: user?.PPhone,
      State: user?.PState,
      Zip: user?.PZip,
      Residence: user?.PResidence === "1",
      SaveAddress: user?.PAddToAddress === "1",
    },
    {
      StopType: "D",
      edit: true,
      disableRemove: true,
      Address: user?.DAddress,
      Building: user?.DRoom,
      City: user?.DCity,
      Name: user?.DName,
      Notes: user?.DNote,
      Phone: user?.DPhone,
      State: user?.DState,
      Zip: user?.DZip,
      Residence: user?.DResidence === "1",
      SaveAddress: user?.DAddToAddress === "1",
      requiredRoom: user?.reqDRoom === "0" ? false : true,
      requiredPhone: user?.reqDPhone === "0" ? false : true,
    },
  ];
  const formState = useForm<IFormPlaceOrder>({
    defaultValues: {
      delivery_date: new Date(),
      delivery_time: new Date(),
      cashondelivery: false,
      references: [{ reference: "" }, { reference: "" }],
      stops: stopsDefault,
      deliveryServiceType: user?.Service,
      packageType: user?.PackageTypeID,
      vehicle: user?.VehicleTypeID,
      pieces: user?.Pieces,
      weight: user?.Weight,
      declaredvalue: user?.DeclaredValue,
      description: user?.Description,
    } as any,
  });

  const value = useMemo(
    () => ({
      formState: formState,
    }),
    [formState]
  );

  return (
    <PlaceOrderContext.Provider value={value}>
      {children}
    </PlaceOrderContext.Provider>
  );
};

export default PlaceOrderContextProvider;
