import styled from "@emotion/styled";
import { Row } from "antd";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { SVGTrash } from "../../../svgs/SVGTrash";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import type { IFormItem } from "../../create-account/FormItem";

interface Props {
  optionsNotify: Array<IFormItem>;
  fields: Array<{ id: string }>;
  control: any;
  removeItem: (index: number) => () => void;
  insertItem: () => void;
}

const renderItem =
  (formItem: IFormItem & { index: number }) =>
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
    const {
      type = "",
      options = [],
      dataTestid,
      label,
      index,
      ...rest
    } = formItem;
    const itemLabel = index === 0 ? label : "";
    if (type === "selection") {
      return (
        <>
          <Label>{itemLabel}</Label>
          <WrapperSelect data-testid="select">
            <Select
              error={error?.message || ""}
              options={options}
              data-testid={dataTestid}
              {...rest}
              name={name}
              label=""
              onChange={onChange}
              value={value ?? formItem.value}
            />
          </WrapperSelect>
        </>
      );
    }

    return (
      <>
        <Label>{itemLabel}</Label>
        <Input
          {...rest}
          name={name}
          onChange={onChange}
          error={error?.message || ""}
          id={dataTestid}
          value={value ?? ""}
          label={""}
        />
      </>
    );
  };

export const EditNotification = (props: Props) => {
  const { optionsNotify, fields, control, insertItem, removeItem } = props;
  function renderRow(index: number) {
    return (
      <>
        {optionsNotify.map((item: IFormItem) => {
          const key = `notification.${index}.${item.key}`;
          return (
            <Card key={key} className="mr-3">
              <Controller
                name={key}
                control={control}
                render={renderItem({ ...item, index })}
              />
            </Card>
          );
        })}
      </>
    );
  }
  return (
    <WrapperItem>
      <EditContent>
        {fields.map((field: { id: string }, index: number) => {
          return (
            <Row key={field.id} style={{ flex: 1 }}>
              {renderRow(index)}
              <WrapperTrash
                data-testid="notification-button-remove"
                className="ml-4"
                onClick={removeItem(index)}
              >
                <SVGTrash />
              </WrapperTrash>
            </Row>
          );
        })}
      </EditContent>
      <ButtonAdd onClick={insertItem} data-testid="notification-button-add">
        + Add a contact option
      </ButtonAdd>
    </WrapperItem>
  );
};

const EditContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  @media only screen and (max-width: 600px) {
    width: 100%;
    display: block;
    gap: 4px;
    align-items: flex-start;
  }
`;

const WrapperTrash = styled.button`
  align-self: flex-end;
  margin-bottom: 7px;
`;

const WrapperItem = styled.div`
  flex: 1;
  flex-direction: column;
`;

const ButtonAdd = styled.button`
  margin-top: 22px;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
`;

const Card = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 16px;
`;

const Label = styled.div`
  text-align: left;
  font-size: 15px;
  font-weight: normal;
`;

const WrapperSelect = styled.div`
  min-width: 140px;
`;
