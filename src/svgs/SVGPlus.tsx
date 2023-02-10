import clsx from "clsx";
import { clsDefaultSVG } from "../utils/generals";

export const SVGPlus = ({
  onClick,
  className,
}: {
  onClick?: any;
  className?: string;
}) => {
  return (
    <svg
      className={clsx(clsDefaultSVG, className)}
      onClick={onClick}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 16C23 16.5523 22.5523 17 22 17L17 16.999V22C17 22.5523 16.5523 23 16 23C15.4477 23 15 22.5523 15 22V16.999L10 17C9.44772 17 9 16.5523 9 16C9 15.4477 9.44772 15 10 15L15.001 14.999L15 10C15 9.44772 15.4477 9 16 9C16.5523 9 17 9.44772 17 10L17.001 14.999L22 15C22.5523 15 23 15.4477 23 16Z"
        fill="#394048"
      />
    </svg>
  );
};
