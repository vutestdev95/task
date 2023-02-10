import { memo } from "react";

const ReportLogo = ({ color = "#8DA4BE" }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 9V2c3.855 0 7 3.145 7 7h-7zm-9 1.992C2 7.142 5.129 4 9 4v7.008h7C16 14.858 12.871 18 9 18c-3.855 0-7-3.158-7-7.008z"
        fill={color}
      />
    </svg>
  );
};

export default memo(ReportLogo);
