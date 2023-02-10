import styled from "@emotion/styled";
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

type CustomButtonProps = {
  prefixIcon?: React.ReactNode;
  gap?: number | string;
  suffixIcon?: React.ReactNode;
  text: string;
  paddingX: number | string;
  height: number;
  color: string;
  fontSize: number | string;
  bgc: string;
  boxShadow?: string;
  border?: string;
  onClick?: any;
  hoverColor?: string;
  hoverBgc?: string;
  disableBgc?: string;
  disableBorder?: string;
  disabled?: boolean;
  width: number | string;
  type?: "button" | "submit" | "reset";
};

const CustomButton: React.FC<CustomButtonProps> = ({ type, ...rest }) => {
  return (
    <StyledButton type={type || "button"} {...rest}>
      {rest.prefixIcon && <>{rest.prefixIcon}</>}
      <span>{rest.text}</span>
      {rest.suffixIcon && <>{rest.suffixIcon}</>}
    </StyledButton>
  );
};

export { CustomButton };

const StyledButton = styled.button<{
  paddingX: number | string;
  height: number | string;
  width: number | string;
  color: string;
  fontSize: number | string;
  bgc: string;
  hoverColor?: string;
  hoverBgc?: string;
  disableBgc?: string;
  disableBorder?: string;
  boxShadow?: string;
  border?: string;
  gap?: string | number;
}>`
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${(props) => props.gap || 0}px;
  padding-left: ${(props) => props.paddingX}px;
  padding-right: ${(props) => props.paddingX}px;
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height}px;
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-weight: 500;
  background-color: ${(props) => props.bgc};
  box-shadow: ${(props) => props.boxShadow};
  border: ${(props) => (props.border ? props.border : "none")};
  &:hover {
    color: ${(props) => props.hoverColor || props.color};
    background-color: ${(props) => props.hoverBgc || props.bgc};
  }
  &:disabled {
    background-color: ${(props) => props.disableBgc || props.bgc};
    border: ${(props) => props.disableBorder || props.border};
  }
`;

interface IBaseButton {
  color: any;
  bgc: any;
  hoverBgc: any;
  disableBgc: any;
  fontSize: any;
  border: any;
  boxShadow: any;
  disableBorder: any;
  height: any;
  paddingX: any;
}

export const CustomButtonPrimary: React.FC<
  Omit<CustomButtonProps, keyof IBaseButton>
> = (props) => {
  const baseProps: IBaseButton = {
    color: "#fff",
    bgc: "#14305a",
    hoverBgc: "#102648",
    disableBgc: "#cbd0df",
    fontSize: 16,
    border: "solid 1px rgba(0, 0, 0, 0.2)",
    boxShadow: "0 2px 1px 0 rgba(44, 58, 110, 0.12)",
    disableBorder: "none",
    height: 40,
    paddingX: "24",
  };
  return <CustomButton {...baseProps} {...props} />;
};

export const CustomButtonSecondary: React.FC<
  Omit<CustomButtonProps, keyof IBaseButton> & {
    blackOrBlue: "black" | "blue";
    largeOrSmallText: "large" | "small";
  }
> = (props) => {
  const isMobile = useIsMobile({});
  const baseProps: IBaseButton = {
    color: props.blackOrBlue === "black" ? "#102a47" : "#406aff",
    bgc: "transparent",
    hoverBgc:
      props.blackOrBlue === "black" ? "rgba(141, 164, 190, 0.2)" : "#ecf0ff",
    disableBgc: "transparent",
    fontSize: props.largeOrSmallText === "large" ? 16 : 14,
    border: "none",
    boxShadow: "none",
    disableBorder: "none",
    height: 32,
    paddingX: isMobile ? "0" : "8",
  };
  return <CustomButton {...baseProps} {...props} />;
};
