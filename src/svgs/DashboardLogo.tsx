import { memo } from "react";

const DashboardLogo = ({ color = "#8DA4BE" }) => {
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
        d="M3 2.833c0-.46.373-.833.833-.833h4.334c.46 0 .833.373.833.833v14.334c0 .46-.373.833-.833.833H3.833A.833.833 0 0 1 3 17.167V2.833zm8 7c0-.46.373-.833.833-.833h4.334c.46 0 .833.373.833.833v7.334c0 .46-.373.833-.833.833h-4.334a.833.833 0 0 1-.833-.833V9.833zM11.833 2a.833.833 0 0 0-.833.833v3.334c0 .46.373.833.833.833h4.334c.46 0 .833-.373.833-.833V2.833A.833.833 0 0 0 16.167 2h-4.334z"
        fill={color}
      />
    </svg>
  );
};

export default memo(DashboardLogo);
