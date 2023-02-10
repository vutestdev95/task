import { Button, InputGroup, InputGroupProps2, Icon } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { useCallback, useMemo, useState } from "react";
import { FieldError, FieldPathValue, FieldValues } from "react-hook-form";
import { IFormItem } from "./FormItem";
import { IconNames } from "@blueprintjs/icons";
import cls from "../common/Select.module.css";
import { Tooltip } from "antd";
import { FormLabel } from "../common/FormLabel";
import { COLORS } from "../common/Constants";
import styled from "@emotion/styled";

interface Props {
  error?: FieldError;
  onChange: (...event: any[]) => void;
  value: FieldPathValue<FieldValues, string>;
  name: string;
  labelQuestionMark?: string;
  label?: string;
}
export const InputPassword = (
  props: InputGroupProps2 & Props & Partial<IFormItem>
) => {
  const { labelQuestionMark, dataTestid, id, label } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((showPassword: boolean) => !showPassword);
  }, [setShowPassword]);

  const lockButton = useMemo(
    () => (
      <Tooltip2 content={`${showPassword ? "Hide" : "Show"} Password`}>
        <StyledButton
          icon={showPassword ? "eye-off" : "eye-open"}
          minimal={true}
          onClick={toggleShowPassword}
          data-testid={`${id}-toogle-show-password`}
        />
      </Tooltip2>
    ),
    [toggleShowPassword, showPassword, id]
  );

  return (
    <>
      {label && (
        <WrapperLabel>
          <FormLabel htmlFor={"name"} label={label} />
          {!!labelQuestionMark && (
            <Tooltip title={labelQuestionMark} className="mb-1 ml-2">
              <Icon
                color={COLORS.PlaceholderColor4BEMediumGrey}
                className={cls.optionIcon}
                icon={IconNames.Help}
              />
            </Tooltip>
          )}
        </WrapperLabel>
      )}
      <StyledInput
        id={dataTestid}
        rightElement={lockButton}
        required
        data-testid={dataTestid}
        {...props}
        type={showPassword ? "text" : "password"}
      />
    </>
  );
};

const WrapperLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledInput = styled(InputGroup)`
  transition: border 0.3s, box-shadow 0.3s;
  background: #ffffff;
  .bp4-input {
    border: 1px solid ${COLORS.BorderColor4DF};
    box-shadow: 0px 1px 1px 0 rgba(44, 58, 110, 0.06);
    border-radius: 6px;
    ::placeholder {
      color: ${COLORS.PlaceholderColor4BEMediumGrey};
    }
    font-size: 16px;
    line-height: 1.25;
    text-align: justify;
    color: ${COLORS.DarkestGreyA47};
    width: 100%;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${COLORS.FocusBoxShadowNormalColor};

      border: 1px solid ${COLORS.FocusBorderColor};
    }
    &[disabled] {
      background: #f4f5f7;
    }
  }
`;

const StyledButton = styled(Button)`
  .bp4-icon {
    color: ${COLORS.PlaceholderColor4BEMediumGrey};
  }
`;
