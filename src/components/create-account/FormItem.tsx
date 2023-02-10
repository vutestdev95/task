import { Checkbox, H6 } from "@blueprintjs/core";
import styled from "@emotion/styled";
import { Col, Row } from "antd";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { bps } from "../common/Constants";
import { FormError } from "../common/FormError";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { InputPassword } from "./InputPassword";

export interface IFormItem {
  key: string;
  dataTestid: string;
  label: string;
  placeholder: string;
  value?: any;
  type?: "selection" | "input" | "checkbox" | "inputPassword" | string;
  subTitle?: string;
  labelQuestionMark?: string;
  scaleSpan?: number;
  isRequired?: boolean;
  isDisable?: boolean;
  options?: Array<
    Partial<{ name: string; code: string; label: string; value: any }>
  >;
}

interface Props {
  formData: any;
  formFields: Array<IFormItem[]>;
  errorConfirmPassword?: string;
  errorEmail?: string;
}

interface ErrorMessage {
  errorConfirmPassword?: string;
  errorEmail?: string;
}

const renderItem =
  (
    { type = "input", ...restFormItem }: IFormItem,
    { errorConfirmPassword, errorEmail }: ErrorMessage
  ) =>
  ({
    field,
    fieldState,
  }: {
    field: ControllerRenderProps<FieldValues, string>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<FieldValues>;
  }) => {
    const { error } = fieldState;
    const { onChange, value, name } = field;

    switch (type) {
      case "selection":
        const options = restFormItem?.options ?? [];
        return (
          <Select
            nominwidth
            error={error?.message || ""}
            options={options}
            data-testid={restFormItem.dataTestid}
            {...restFormItem}
            name={name}
            onChange={onChange}
            value={value ?? ""}
          />
        );
      case "checkbox":
        return (
          <CheckboxWrapper
            name={name}
            onChange={onChange}
            checked={value ?? false}
            data-testid={restFormItem.dataTestid}
            id={restFormItem.dataTestid}
            large
          >
            <p>{restFormItem.label}</p>
          </CheckboxWrapper>
        );
      case "inputPassword":
        return (
          <>
            <InputPassword
              label={restFormItem.label}
              id={restFormItem.dataTestid}
              data-testid={restFormItem.dataTestid}
              placeholder={restFormItem.placeholder}
              name={name}
              onChange={onChange}
              value={value ?? ""}
            />
            {errorConfirmPassword && (
              <FormError errorMessage={errorConfirmPassword} />
            )}
            {restFormItem?.subTitle && (
              <SubTitle span={24}>{restFormItem.subTitle}</SubTitle>
            )}
          </>
        );
      default:
        return (
          <>
            <Input
              {...restFormItem}
              name={name}
              onChange={onChange}
              error={error?.message || ""}
              disabled={restFormItem.isDisable}
              id={restFormItem.dataTestid}
              value={value ?? ""}
            />
            {!!errorEmail && restFormItem.key === "Email" && (
              <FormError errorMessage={errorEmail} />
            )}
          </>
        );
    }
  };

export const FormItem = (props: Props) => {
  const { formData, formFields, errorConfirmPassword, errorEmail } = props;
  return (
    <Container>
      {formFields.map((item: Array<IFormItem>, index: number) => {
        return (
          <Row gutter={[16, 0]} key={`FormItem_${String(index)}`}>
            {item.map((fields: IFormItem) => {
              return (
                <ColItem
                  key={fields.key}
                  className="mb-4"
                  span={fields?.scaleSpan ?? 12}
                  xs={24}
                  sm={fields?.scaleSpan ?? 12}
                >
                  <Controller
                    rules={{
                      required: {
                        value: !!fields?.isRequired,
                        message: "This is required",
                      },
                    }}
                    name={fields?.key}
                    control={formData}
                    render={renderItem(fields, {
                      errorConfirmPassword,
                      errorEmail,
                    })}
                  />
                </ColItem>
              );
            })}
          </Row>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: inline;
`;

const ColItem = styled(Col)`
  display: inline;
  text-align: left;
`;

const SubTitle = styled(H6)`
  width: 30rem;
  font-size: 12px;
  font-weight: normal;
  margin-top: 8px;
  text-align: left;
  color: #576f8b;
  @media (max-width: ${bps["sm"]}px) {
    width: 28rem;
  }
`;

const CheckboxWrapper = styled(Checkbox)`
  width: 100%;
  display: flex !important;
  align-items: center !important;
  padding: 6px;
  padding-left: 32px !important;
  :hover {
    border-radius: 6px;
    background-color: #f4f5f7;
  }
`;
