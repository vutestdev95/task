import React, { useCallback, useMemo } from "react";
import { Controller } from "react-hook-form";
import { useAuth } from "../AuthProvider";
import { bps } from "../common/Constants";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { BodySectionContainer } from "./DeliveryDate";
import { usePlaceOrder } from "./PlaceOrderProvider";
import { Section } from "./Section";
import { SwitchCustom } from "./stops-section/StopItem/StopItemDetail";

interface PackageDetailsProps {}

enum EDeliveryServiceType {
  "SAME_DAY" = "Same-day delivery",
}

enum EPackageType {
  "BOX SMALL" = "Box (Small)",
  "BOX BIG" = "Box (Big)",
}

enum EVehicle {
  "Motocycle" = "Motocycle",
  "Bicycle" = "Bicycle",
}

const PackageDetails: React.FC<PackageDetailsProps> = () => {
  const { control } = usePlaceOrder().formState || {};

  const { user } = useAuth().state;

  const packageTypes = useMemo(
    () =>
      (user?.PackageTypes || []).map((packageItem) => ({
        label: packageItem?.PackageName,
        value: packageItem?.PackageValue,
      })),
    [user?.PackageTypes]
  );
  const servicesTypes = useMemo(
    () =>
      (user?.ServiceTypes || []).map((service) => ({
        label: service?.ServiceName,
        value: service?.ServiceValue,
      })),
    [user?.ServiceTypes]
  );

  const vehicleTypes = useMemo(
    () =>
      (user?.VehicleTypes || []).map((vehicle) => ({
        label: vehicle?.VehicleName,
        value: vehicle?.VehicleValue,
      })),
    [user?.VehicleTypes]
  );

  const renderDeliveryServiceType = useCallback(
    ({ field: { value, onChange }, fieldState: { error } }) => {
      return (
        <div>
          <Select
            label="Delivery Service type"
            name="deliveryServiceType"
            error={error?.message || ""}
            placeholder="Select service type"
            options={servicesTypes}
            value={value}
            onChange={onChange}
          />
        </div>
      );
    },
    [servicesTypes]
  );

  const renderPackageType = useCallback(
    ({ field: { value, onChange }, fieldState: { error } }) => (
      <div>
        <Select
          label="Package type (optional)"
          name="packageType"
          error={error?.message || ""}
          placeholder="Select package type"
          options={packageTypes}
          value={value}
          onChange={onChange}
        />
      </div>
    ),
    [packageTypes]
  );

  const renderPieces = useCallback(
    ({ field: { value, onChange }, fieldState: { error } }) => (
      <div>
        <Input
          value={value}
          onChange={onChange}
          placeholder="e.g. 3"
          label="Pieces"
          error={error?.message || ""}
          name="input-pieces"
        />
      </div>
    ),
    []
  );

  const renderWeight = useCallback(
    ({ field: { value, onChange }, fieldState: { error } }) => (
      <div>
        <Input
          value={value}
          readonly
          name="input-weight"
          onChange={onChange}
          placeholder="e.g. 5lbs"
          label="Weight"
          error={error?.message || ""}
        />
      </div>
    ),
    []
  );

  const renderVehicle = useCallback(
    ({ field: { value, onChange }, fieldState: { error } }) => (
      <div>
        <Select
          name="vehicle"
          label="Vehicle"
          error={error?.message || ""}
          placeholder="Select vehicle"
          options={vehicleTypes}
          value={value}
          onChange={onChange}
        />
      </div>
    ),
    [vehicleTypes]
  );

  const renderDeclaredValue = useCallback(
    ({ field: { value, onChange }, fieldState: { error } }) => (
      <div>
        <Input
          value={value}
          onChange={onChange}
          placeholder="e.g. 50"
          label="Declared value"
          error={error?.message || ""}
          name="input-declaredvalue"
        />
      </div>
    ),
    []
  );

  const renderDescription = useCallback(
    ({ field: { value, onChange }, fieldState: { error } }) => (
      <div className="description-container">
        <Input
          value={value}
          onChange={onChange}
          placeholder="Add a description"
          label="Description (optional)"
          error={error?.message || ""}
          name="input-description"
        />
      </div>
    ),
    []
  );

  const renderCashonDelivery = useCallback(
    ({ field: { value, onChange } }) => (
      <div className="address-books-container">
        <SwitchCashOnDeliveryContainer
          label="Cash on delivery"
          large
          checked={value}
          onChange={onChange}
          dataTestId={"switch-cashondelivery"}
        />
      </div>
    ),
    []
  );

  return (
    <Section
      dataTestId="section-package-details"
      body={
        <BodySectionContainer
          custom={`
        grid-template-columns: 1fr;
        @media (min-width: ${bps["sm"]}px) {

        }
        @media (min-width: ${bps["md"]}px) {

        }
        @media (min-width: ${bps["lg"]}px) {
          grid-template-columns: 1fr 1fr;

          .description-container, .address-books-container {
            grid-column: 1 / span 2;
          }
        }
        @media (min-width: ${bps["xl"]}px) {

        }
        @media (min-width: ${bps["2xl"]}px) {

        }
      `}
        >
          <Controller
            name="deliveryServiceType"
            control={control}
            defaultValue=""
            render={renderDeliveryServiceType}
          />
          <Controller
            name="packageType"
            control={control}
            defaultValue=""
            render={renderPackageType}
          />
          <Controller
            name="pieces"
            control={control}
            rules={{
              required: { value: true, message: "This is required" },
            }}
            defaultValue=""
            render={renderPieces}
          />
          <Controller
            name="weight"
            control={control}
            defaultValue=""
            rules={{
              required: { value: true, message: "This is required" },
            }}
            render={renderWeight}
          />
          <Controller
            name="vehicle"
            control={control}
            defaultValue=""
            render={renderVehicle}
          />
          <Controller
            name="declaredvalue"
            control={control}
            defaultValue=""
            render={renderDeclaredValue}
          />
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={renderDescription}
          />
          <Controller
            name="cashondelivery"
            control={control}
            defaultValue={false}
            render={renderCashonDelivery}
          />
        </BodySectionContainer>
      }
      hasButtonCollapse
      title="Package Details"
    />
  );
};

export { PackageDetails, EDeliveryServiceType, EPackageType, EVehicle };

const SwitchCashOnDeliveryContainer = ({
  label,
  large,
  checked,
  onChange,
  dataTestId,
}: {
  label: any;
  large: any;
  checked: any;
  onChange: any;
  dataTestId: any;
}) => {
  const handleChange = useCallback(
    (value: any) => {
      onChange(value.currentTarget.checked);
    },
    [onChange]
  );
  return (
    <SwitchCustom
      label={label}
      large={large}
      checked={checked}
      onChange={handleChange}
      data-testid={dataTestId}
    />
  );
};
