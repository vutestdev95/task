import {
  Button,
  Checkbox,
  Divider,
  H3,
  Icon,
  Menu,
  MenuDivider,
  MenuItem,
  Switch,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { ItemRenderer, Select2 } from "@blueprintjs/select";
import styled from "@emotion/styled";
import { Col, Row } from "antd";
import { FunctionComponent, memo, useCallback, useMemo } from "react";
import { Controller } from "react-hook-form";
import { Input } from "../../../common/Input";
import { Select } from "../../../common/Select";
import FormItemCustom from "../../../FormItem";
import { ButtonSaveEditClear } from "../../billing-infomation";
import { usePlaceOrder } from "../../PlaceOrderProvider";
import STATES from "./states.json";

const StopContainer = styled.div``;

const StopTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const StopStatus = styled(H3)`
  display: inline;
  margin-bottom: 0;
  cursor: pointer;
  height: 24px;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #102a47;
`;

const StopTitleRight = styled.div`
  display: flex;
  align-items: center;
`;

const StopTitleActionText = styled.p`
  font-size: 14px;
  line-height: 16px;
  color: #8da4be;
  cursor: pointer;
  &:hover {
    color: #102a47;
  }
`;

const StopContent = styled.div``;

export const StopAddressText = styled.p`
  width: 218px;
  maxwidth: 100%;
  margin-bottom: 8px;

  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #102a47;
`;

export const StopAddressContact = styled.p`
  width: 124px;
  margin-bottom: 32px;

  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #576f8b;
`;

const SelectStatus = styled(Select2)`
  .bp4-button-text {
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    color: #102a47;
  }
`;

const FormItem = styled(FormItemCustom)`
  .bp4-label {
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: justify;
    color: #394048;
  }

  [for="text-input-save-address"] {
    font-size: 15px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #000;
  }
`;

export const CheckboxCustom = styled(Checkbox)<{
  marginright: number;
  marginbottom?: number;
}>`
  &.bp4-control {
    margin-bottom: ${(props) => props.marginbottom ?? 10}px !important;
  }
  .bp4-control-indicator {
    vertical-align: text-bottom;
  }
  &.bp4-control.bp4-large:not(.bp4-align-right) {
  }

  &.bp4-control .bp4-control-indicator {
    margin-right: ${(props) => props.marginright}px;
  }
`;

const ToogleEditButton = styled(Button)`
  border: none !important;
`;

export const SwitchCustom = styled(Switch)`
  padding: 6px;
  margin-top: 0 !important;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: justify;
  color: #000;
  height: 32px;
  &:hover {
    border-radius: 6px;
    background-color: #f4f5f7;
  }
  .bp4-control-indicator {
    vertical-align: text-bottom;
    margin-left: -39px !important;
    min-with: 2em;
  }
`;

const AddStopText = styled.p`
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: justify;
  color: #102a47;
`;

const SelectPopoverContainer = styled.div`
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0 2px 6px 2px rgba(44, 58, 110, 0.1);
  border: solid 1px #cbd0df;
  background-color: #fff;
  overflow: auto;
  max-height: 300px;

  .bp4-menu {
    padding: 0;
  }

  li.bp4-menu-divider {
    width: calc(100% + 12px);
    margin-left: -6px;
  }

  li {
    padding: 6;
    border-radius: 6px;

    .bp4-fill.bp4-text-overflow-ellipsis {
      font-size: 15px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: left;
      color: #102a47;
    }

    .bp4-selected {
      color: #406aff;
      background-color: white;
      .bp4-fill.bp4-text-overflow-ellipsis {
        color: #406aff;
      }
    }

    &:hover {
      background-color: #f4f5f7;
    }
  }

  .delete {
    &:hover {
      background-color: #feeeef;
      .bp4-fill.bp4-text-overflow-ellipsis {
        color: #fa545e;
      }
    }
  }
`;

const OrDivider = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  position: relative;
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: center;
  color: #576f8b;

  &:before,
  :after {
    position: absolute;
    width: 45%;
    height: 1px;
    background-color: #cbd0df;
    content: "";
    top: 8px;
  }

  &:before {
    left: 0;
  }

  &:after {
    right: 0;
  }
`;

const STOP_TYPES: any[] = [
  { title: "Pick up", key: "P" },
  { title: "Destination", key: "D" },
  { title: "Pick up and Destination", key: "B" },
  { title: "Delete", key: "R" },
];

const STATE_CODES = STATES.map((d) => d.code);

interface StopItemDetailProps {
  id: string;
  index: number;
  field: any;
  dragElement: any;
  onToogleEdit: () => void;
  onAddStop: () => void;
  onRemoveStop: () => void;
  onResetStop: () => void;
}
export const StopItemView: FunctionComponent<StopItemDetailProps> = memo(
  ({ field, dragElement, onToogleEdit, onAddStop }) => {
    const address = [
      field?.Address,
      field?.Zip,
      `${field.City} ${field.State}`,
      "USA",
      field?.Building,
    ]
      ?.filter((d) => d)
      ?.join(", ");
    return (
      <StopContainer data-testid="place-order-stops-item-view">
        <StopTitle ref={dragElement}>
          <StopStatus data-testid="place-order-stops-item-view-status">
            {STOP_TYPES.find((item) => item.key === field?.StopType)?.title}
          </StopStatus>
          <StopTitleRight>
            <ToogleEditButton onClick={onToogleEdit} outlined>
              <StopTitleActionText>Edit</StopTitleActionText>
            </ToogleEditButton>
            <Divider style={{ height: "100%", margin: "0 16px" }} />
            <ToogleEditButton outlined>
              <Icon icon={IconNames.ChevronUp} />
            </ToogleEditButton>
          </StopTitleRight>
        </StopTitle>
        <StopContent>
          <StopAddressText data-testid="place-order-stops-item-view-address">
            {address}
          </StopAddressText>
          <StopAddressContact data-testid="place-order-stops-item-view-contact">
            {field?.Phone} {field?.Email}
          </StopAddressContact>

          {(!field.disableRemove || field.StopType !== "D") && (
            <Button
              icon={IconNames.Plus}
              outlined
              style={{ color: "#102a47" }}
              onClick={onAddStop}
              data-testid="place-order-stops-item-add-stop"
            >
              <AddStopText>Add Stop</AddStopText>
            </Button>
          )}
        </StopContent>
      </StopContainer>
    );
  }
);

const renderFilm: ItemRenderer<any> = (
  item,
  { handleClick, handleFocus, modifiers }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <div key={item.key}>
      {item?.key === "R" && <MenuDivider />}
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={item.key}
        onClick={handleClick}
        onFocus={handleFocus}
        roleStructure="listoption"
        text={`${item.title}`}
        labelElement={modifiers.active ? <Icon icon={IconNames.Tick} /> : null}
        className={item?.key === "R" ? "delete" : ""}
      />
    </div>
  );
};

const equalItem = (a: any, b: any) => a.key === b.key;

const listRender = ({ filteredItems, renderItem }: any) => {
  const renderedItems = filteredItems.map(renderItem);

  return (
    <SelectPopoverContainer>
      <Menu>{renderedItems}</Menu>
    </SelectPopoverContainer>
  );
};

const rulesRequired = {
  required: {
    value: true,
    message: "This is required",
  },
};

const rulesValidateEmail = {
  pattern: {
    value:
      // eslint-disable-next-line no-useless-escape
      /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    message: "Email entered is valid",
  },
};

const rulesValidateZip = {
  required: { value: true, message: "This is required" },
  pattern: {
    value: /(^\d{5}$)|(^\d{5}-\d{4}$)/,
    message: "Postal Code entered is invalid",
  },
};

const InputStopSaveAddress = ({ field: { onChange, value } }: any) => {
  const change = useCallback(
    (value: any) => {
      onChange(value.currentTarget.checked);
    },
    [onChange]
  );
  return (
    <SwitchCustom
      label="Add to Address Books"
      large
      checked={value}
      onChange={change}
      data-testid="place-order-stops-item-edit-save-address"
    />
  );
};

export const StopItemEdit: FunctionComponent<StopItemDetailProps> = memo(
  ({
    index,
    dragElement,
    field,
    onToogleEdit,
    onAddStop,
    onRemoveStop,
    onResetStop,
  }) => {
    const { control } = usePlaceOrder().formState || {};
    const changeStatus = useCallback(
      (value, onChange) => {
        if (value?.key === "R") {
          onRemoveStop();
          return;
        }
        onChange(value.key);
      },
      [onRemoveStop]
    );
    const onChange = useCallback(() => {}, []);

    const inputStopType = useCallback(
      ({ field: { onChange, value } }) => {
        return (
          <SelectStatusComponent
            changeStatus={changeStatus}
            onChange={onChange}
            field={field}
            value={value}
          />
        );
      },
      [changeStatus, field]
    );

    const inputStopFindAdrress = useCallback(
      ({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          value={value}
          onChange={onChange}
          name="place-order-stops-item-edit-search-address"
          data-testid="place-order-stops-item-edit-search-address"
          label="Add from Address Book"
          error={error?.message || ""}
          placeholder="Search for an address"
          searchIcon
        />
      ),
      []
    );

    const inputStopName = useCallback(
      ({ field, fieldState: { error } }) => (
        <Input
          onChange={field.onChange}
          value={field.value}
          onBlur={field.onBlur}
          name={`stops.${index}.Name`}
          label="Name"
          error={error?.message || ""}
          placeholder="e.g. John Smith"
          dataTestid="place-order-stops-item-edit-name"
        />
      ),
      [index]
    );

    const inputStopAddress = useCallback(
      ({ field, fieldState: { error } }) => (
        <Input
          onChange={field.onChange}
          value={field.value}
          onBlur={field.onBlur}
          name={`stops.${index}.Address`}
          label="Street Address"
          error={error?.message || ""}
          placeholder="e.g. 2700 Greens Rd."
          dataTestid="place-order-stops-item-edit-address"
        />
      ),
      [index]
    );

    const inputStopBuilding = useCallback(
      ({ field, fieldState: { error } }) => (
        <Input
          onChange={field.onChange}
          value={field.value}
          onBlur={field.onBlur}
          name={`stops.${index}.Building`}
          label="Apartment, Suit, Building"
          error={error?.message || ""}
          placeholder="e.g. Door 27, Floor 4"
          dataTestid="place-order-stops-item-edit-building"
        />
      ),
      [index]
    );

    const inputStopCity = useCallback(
      ({ field, fieldState: { error } }) => (
        <Input
          onChange={field.onChange}
          value={field.value}
          onBlur={field.onBlur}
          name={`stops.${index}.City`}
          label="City"
          error={error?.message || ""}
          placeholder="e.g. Houston"
          dataTestid="place-order-stops-item-edit-city"
        />
      ),
      [index]
    );

    const inputStopState = useCallback(
      ({ field: { onChange, value, name }, fieldState: { error } }) => (
        <Select
          dataTestid="place-order-stops-item-edit-state"
          label="State"
          error={error?.message || ""}
          name={name}
          onChange={onChange}
          options={STATES.map((state) => ({
            label: state.name,
            value: state.code,
          }))}
          placeholder="Select a state"
          value={STATE_CODES.includes(value || "") ? value : ""}
        />
      ),
      []
    );

    const inputStopZip = useCallback(
      ({ field, fieldState: { error } }) => (
        <Input
          onChange={field.onChange}
          value={field.value}
          onBlur={field.onBlur}
          name={`stops.${index}.Zip`}
          label="Postal code"
          error={error?.message || ""}
          placeholder="e.g. SC456"
          dataTestid="place-order-stops-item-edit-zip"
        />
      ),
      [index]
    );

    const inputStopResidence = useCallback(
      ({ field: { onChange, onBlur, value } }) => (
        <CheckboxCustom
          marginright={8}
          label="Residence"
          large
          onBlur={onBlur}
          onChange={onChange}
          checked={value}
          data-testid="place-order-stops-item-edit-residence"
        />
      ),
      []
    );

    const inputStopNotes = useCallback(
      ({ field, fieldState: { error } }) => (
        <Input
          onChange={field.onChange}
          value={field.value}
          onBlur={field.onBlur}
          name={`stops.${index}.Notes`}
          label="Stop notes (optional)"
          error={error?.message || ""}
          placeholder="e.g. Leave at front desk"
          dataTestid="place-order-stops-item-edit-notes"
        />
      ),
      [index]
    );

    const inputStopPhone = useCallback(
      ({ field: fieldInput, fieldState: { error } }) => (
        <Input
          onChange={fieldInput.onChange}
          value={fieldInput.value}
          onBlur={fieldInput.onBlur}
          name={`stops.${index}.Phone`}
          label={`Contact phone${field.requiredPhone ? " (optional)" : ""}`}
          error={error?.message || ""}
          placeholder="e.g. 555 918 301"
          dataTestid="place-order-stops-item-edit-phone"
        />
      ),
      [field.requiredPhone, index]
    );

    const inputStopEmail = useCallback(
      ({ field, fieldState: { error } }) => (
        <Input
          onChange={field.onChange}
          value={field.value}
          onBlur={field.onBlur}
          name={`stops.${index}.Email`}
          label="Contact e-mail (optional)"
          error={error?.message || ""}
          placeholder="e.g. john@example.com"
          dataTestid="place-order-stops-item-edit-email"
        />
      ),
      [index]
    );

    const rulesValidateRoom = useMemo(
      () => ({
        required: {
          value: field.requiredRoom,
          message: "This is required",
        },
      }),
      [field.requiredRoom]
    );

    const rulesValidatePhone = useMemo(
      () => ({
        required: {
          value: field.requiredPhone,
          message: "This is required",
        },
      }),
      [field.requiredPhone]
    );

    return (
      <StopContainer data-testid="place-order-stops-item-edit">
        <StopTitle ref={dragElement}>
          <Controller
            control={control}
            name={`stops.${index}.StopType`}
            defaultValue="P"
            render={inputStopType}
          />
          <StopTitleRight>
            <ButtonSaveEditClear
              onClick={onResetStop}
              data-testid="place-order-stops-item-edit-clear-form"
            >
              Clear form
            </ButtonSaveEditClear>

            <Divider style={{ height: "100%", margin: "0 16px" }} />
            <ToogleEditButton outlined>
              <Icon
                icon={IconNames.ChevronUp}
                onClick={onToogleEdit}
                data-testid="place-order-stops-item-edit-switch-to-view"
              />
            </ToogleEditButton>
          </StopTitleRight>
        </StopTitle>
        <StopContent>
          <Controller
            name="addresstrstsr"
            control={control}
            render={inputStopFindAdrress}
          />
          <OrDivider>OR</OrDivider>
          <Row gutter={[16, 0]}>
            <Col className="mb-4" span={24}>
              <Controller
                rules={rulesRequired}
                name={`stops.${index}.Name`}
                control={control}
                render={inputStopName}
              />
            </Col>
            <Col className="mb-4" span={12} xs={24} sm={12}>
              <Controller
                rules={rulesRequired}
                name={`stops.${index}.Address`}
                control={control}
                render={inputStopAddress}
              />
            </Col>
            <Col className="mb-4" span={12} xs={24} sm={12}>
              <Controller
                rules={rulesValidateRoom}
                name={`stops.${index}.Building`}
                control={control}
                render={inputStopBuilding}
              />
            </Col>
            <Col className="mb-4" span={12} xs={24} sm={12}>
              <Controller
                rules={rulesRequired}
                name={`stops.${index}.City`}
                control={control}
                render={inputStopCity}
              />
            </Col>
            <Col className="mb-4" span={12} xs={24} sm={12}>
              <Controller
                control={control}
                rules={{
                  required: { value: true, message: "This is required" },
                }}
                name={`stops.${index}.State`}
                render={inputStopState}
              />
            </Col>
            <Col className="mb-4" span={12} xs={24} sm={12}>
              <Controller
                rules={rulesValidateZip}
                name={`stops.${index}.Zip`}
                control={control}
                render={inputStopZip}
              />
            </Col>
            <Col span={24}>
              <Controller
                control={control}
                name={`stops.${index}.Residence`}
                render={inputStopResidence}
              />
            </Col>
            <Col className="mb-4" span={24}>
              <Controller
                name={`stops.${index}.Notes`}
                control={control}
                render={inputStopNotes}
              />
            </Col>
            <Col className="mb-6" span={12} xs={24} sm={12}>
              <Controller
                rules={rulesValidatePhone}
                name={`stops.${index}.Phone`}
                control={control}
                render={inputStopPhone}
              />
            </Col>
            <Col span={12} xs={24} sm={12}>
              <Controller
                name={`stops.${index}.Email`}
                rules={rulesValidateEmail}
                control={control}
                render={inputStopEmail}
              />
            </Col>
            <Col span={24}>
              <FormItem label="Save Address" labelFor="text-input-save-address">
                <Row gutter={[16, 0]}>
                  <Col span={12} xs={24} sm={12}>
                    <Controller
                      control={control}
                      name={`stops.${index}.SaveAddress`}
                      render={InputStopSaveAddress}
                    />
                  </Col>
                  <Col span={12} xs={24} sm={12}>
                    <Select
                      label=""
                      options={[]}
                      onChange={onChange}
                      value={undefined}
                      error=""
                      name="select-an-address"
                      placeholder="Select an address book"
                    />
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          {(!field.disableRemove || field.StopType !== "D") && (
            <Button
              icon={IconNames.Plus}
              outlined
              style={{ color: "#102a47" }}
              onClick={onAddStop}
              data-testid="place-order-stops-item-add-stop"
            >
              <AddStopText>Add Stop</AddStopText>
            </Button>
          )}
        </StopContent>
      </StopContainer>
    );
  }
);

const SelectStatusComponent = ({
  changeStatus,
  onChange,
  field,
  value,
}: {
  changeStatus: any;
  onChange: any;
  field: any;
  value: any;
}) => {
  const change = useCallback(
    (value: any) => changeStatus(value, onChange),
    [changeStatus, onChange]
  );
  return (
    <SelectStatus
      items={STOP_TYPES}
      itemRenderer={renderFilm}
      onItemSelect={change}
      filterable={false}
      itemListRenderer={listRender}
      popoverProps={{
        minimal: true,
      }}
      disabled={field.disableRemove}
      activeItem={{ key: value }}
      itemsEqual={equalItem}
    >
      <StopStatus data-testid="place-order-stops-item-edit-status">
        {STOP_TYPES.find((item) => item.key === value)?.title}
      </StopStatus>
      <Icon
        icon={IconNames.CaretDown}
        style={{ verticalAlign: "baseline", cursor: "pointer" }}
      />
    </SelectStatus>
  );
};
