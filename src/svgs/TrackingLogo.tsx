import { memo } from "react";

const TrackingLogo = ({ color = "#8DA4BE" }) => {
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
        d="M10.033 2C13.027 2 15.5 4.641 15.5 7.908c0 3.197-2.473 6.565-4.621 9.623-.456.625-1.302.625-1.758 0C6.973 14.473 4.5 11.105 4.5 7.908 4.5 4.64 6.973 2 10.033 2zm0 2.92c1.497 0 2.733 1.32 2.733 2.988 0 1.598-1.236 2.919-2.733 2.919-1.563 0-2.8-1.32-2.8-2.92 0-1.667 1.237-2.988 2.8-2.988z"
        fill={color}
      />
    </svg>
  );
};
export default memo(TrackingLogo);
