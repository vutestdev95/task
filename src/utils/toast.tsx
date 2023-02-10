import styled from "@emotion/styled";
import clsx from "clsx";
import { useCallback } from "react";
import toast, { ToastPosition } from "react-hot-toast";
import { Img } from "../components/common/Img";
import { SVGXIcon } from "../svgs/SVGXIcon";
import { clsDefaultSVG } from "./generals";

export const TOAST_DEFAULT_CONFIG: {
  position: ToastPosition;
  duration: number;
} = {
  position: "top-center",
  duration: 4000,
};

const ButtonCloseToast = ({ id }: { id: any }) => {
  const onClick = useCallback(() => toast.dismiss(id), [id]);
  return (
    <button onClick={onClick} title={"close"}>
      <SVGXIcon className={clsx(`p-[5px] w-6 h-6`, clsDefaultSVG)} />
    </button>
  );
};

const toastGeneric =
  ({ type }: { type: "success" | "error" | "info" }) =>
  (content: string, position?: ToastPosition, duration?: number) => {
    let styles: IToastContainer;
    const caseSuccess = {
      bgcolor: "#e9f6f0",
      bordercolor: "#25a567",
      textcolor: "#25a567",
    };
    switch (type) {
      case "error":
        styles = {
          bgcolor: "#fff8f9",
          bordercolor: "#fa545e",
          textcolor: "#fa545e",
        };
        break;

      case "success":
        styles = caseSuccess;
        break;

      default:
        styles = caseSuccess;
        break;
    }

    const { bgcolor, bordercolor, textcolor } = styles;
    toast(
      (t) => (
        <StyledToastContent
          data-testid={`toast-${type}`}
          bgcolor={bgcolor}
          bordercolor={bordercolor}
          textcolor={textcolor}
        >
          {type === "success" || "info" ? (
            <div
              style={{
                backgroundColor: textcolor,
              }}
              className="flex justify-center items-center w-6 h-6 rounded-[4px]"
            >
              <Img
                alt="check icon"
                width={16}
                height={16}
                src={
                  process.env.PUBLIC_URL +
                  "/images/place-order/check-icon-white.webp"
                }
              />
            </div>
          ) : (
            <div
              style={{
                backgroundColor: textcolor,
              }}
              className="flex justify-center items-center w-6 h-6 rounded-[4px]"
            >
              <Img
                alt="delete icon"
                width={16}
                height={16}
                src={
                  process.env.PUBLIC_URL +
                  "/images/place-order/x-icon-white.webp"
                }
              />
            </div>
          )}

          <ContentToast>{content}</ContentToast>

          <ButtonCloseToast id={t.id} />
        </StyledToastContent>
      ),
      {
        position: position || TOAST_DEFAULT_CONFIG.position,
        duration: duration || TOAST_DEFAULT_CONFIG.duration,
      }
    );
  };

export const toastSuccess = toastGeneric({
  type: "success",
});

export const toastError = toastGeneric({
  type: "error",
});

export const toastInfo = toastGeneric({
  type: "info",
});

interface IToastContainer {
  bordercolor: string;
  bgcolor: string;
  textcolor: string;
}

const StyledToastContent = styled.div<IToastContainer>`
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  column-gap: 8px;
  align-items: center;
  min-width: 292px;
  margin: 0px;
  min-height: 48px;
  border-radius: 6px;
  box-shadow: 0 2px 6px 2px rgba(44, 58, 110, 0.1);
  border: solid 1px ${(props) => props.bordercolor};
  background-color: ${(props) => props.bgcolor};
  padding: 12px;
  color: ${(props) => props.textcolor};
`;

const ContentToast = styled.span`
  font-size: 15px;
  line-height: 1.33;
  font-weight: 500;
`;
