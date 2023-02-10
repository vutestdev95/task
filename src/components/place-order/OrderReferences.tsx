import React, { useCallback } from "react";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { bps } from "../common/Constants";
import { Input } from "../common/Input";
import { BodySectionContainer } from "./DeliveryDate";
import { IFormPlaceOrder, usePlaceOrder } from "./PlaceOrderProvider";
import { Section } from "./Section";

interface OrderReferencesProps {
  children?: Element;
}

const OrderReferences: React.FC<OrderReferencesProps> = () => {
  const { control } = usePlaceOrder().formState || {};
  const { fields } = useFieldArray({
    control,
    name: "references",
    rules: {
      minLength: {
        value: 1,
        message: "This is required",
      },
    },
  });

  const checkValidFormat = useCallback((value: string, format: string): any => {
    if (!format || !value) {
      return true;
    }
    let strRegx = format
      .split("")
      .map((o) => {
        return o
          .replace(/a/g, "[a-zA-Z]")
          .replace(/n/g, `[0-9]`)
          .replace(/u/g, "[A-Z]")
          .replace(/l/g, "[a-z]")
          .replace(/\?/g, ".");
      })
      .join("");
    strRegx = `^${strRegx}$`;
    const regx = new RegExp(strRegx);
    if (regx.test(value)) {
      return true;
    }
    return (
      <div>
        <p>Not match the format: {format}</p>
        <p>
          a = alpha; n = numeric; u = Uppercase; l = lowercase; ? = Any text
        </p>
      </div>
    );
  }, []);

  return (
    <Section
      dataTestId="section-order-references"
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
          }
          @media (min-width: ${bps["xl"]}px) {

          }
          @media (min-width: ${bps["2xl"]}px) {

          }
        `}
        >
          {fields.map((field, index) => {
            return (
              <FieldContent
                key={field.id}
                field={field}
                control={control}
                index={index}
                checkValidFormat={checkValidFormat}
              />
            );
          })}
        </BodySectionContainer>
      }
      hasButtonCollapse
      title="Order References"
    />
  );
};

export { OrderReferences };

const FieldContent = ({
  field,
  control,
  index,
  checkValidFormat,
}: {
  field: any;
  control: Control<IFormPlaceOrder, any>;
  index: number;
  checkValidFormat: (value: string, format: string) => any;
}) => {
  const render = useCallback(
    ({ field: { value, onChange }, fieldState: { error } }) => {
      return (
        <div key={field.id}>
          <Input
            placeholder="Reference detail"
            error={error?.message || ""}
            label={`Reference ${index + 1}`}
            name={`input-order-reference-${index}`}
            value={value}
            onChange={onChange}
          />
        </div>
      );
    },
    [field.id, index]
  );
  return (
    <Controller
      control={control}
      name={`references.${index}.reference`}
      rules={{
        required: { value: true, message: "This is required" },
        validate: (value) => checkValidFormat(value, field.format),
      }}
      render={render}
    />
  );
};
