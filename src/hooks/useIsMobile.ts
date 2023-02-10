import { useMemo } from "react";
import { bps } from "../components/common/Constants";
import { useWindowSize } from "./useWindowSize";

export const useIsMobile = ({
  breakpoint = bps.xl,
}: {
  breakpoint?: number;
}) => {
  const { width } = useWindowSize();

  const isMobile = useMemo(() => {
    if (!width) return true;
    return width < breakpoint;
  }, [width, breakpoint]);

  return isMobile;
};
