import { memo } from "react";

const OrderLogo = ({ color = "#8DA4BE" }) => {
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
        d="M7.012 2.5h9.311l-2.74 2.746A2.49 2.49 0 0 0 12.5 5H4.167l2.256-2.256a.833.833 0 0 1 .589-.244zm6.018 14.81a.83.83 0 0 1-.53.19H3.333a.833.833 0 0 1-.833-.833V7.5a.83.83 0 0 1 .833-.833H12.5c.46 0 .833.373.833.833v9.167c0 .259-.118.49-.303.643zM15 7.5v8.333l2.256-2.256a.833.833 0 0 0 .244-.589V3.68l-2.741 2.748c.155.325.241.688.241 1.072z"
        fill={color}
      />
    </svg>
  );
};

export default memo(OrderLogo);
