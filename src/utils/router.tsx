import { Constants } from "../components/common/Constants";
import DashboardLogo from "../svgs/DashboardLogo";
import OrderLogo from "../svgs/OrderLogo";
import ReportLogo from "../svgs/ReportLogo";
import TrackingLogo from "../svgs/TrackingLogo";

const {
  ROUTES: { home, tracking, placeOrder, report },
} = Constants;

interface IRoutes {
  title: string;
  path: string;
  icon?: any;
  key: "Dashboard" | "Place Order" | "Track Order" | "Reports";
}

export const routes: Array<IRoutes> = [
  {
    title: "Dashboard",
    path: home,
    icon: DashboardLogo,
    key: "Dashboard",
  },
  {
    title: "Place Order",
    path: placeOrder,
    icon: OrderLogo,
    key: "Place Order",
  },
  {
    title: "Track Order",
    path: tracking,
    icon: TrackingLogo,
    key: "Track Order",
  },
  {
    title: "Reports",
    path: report,
    icon: ReportLogo,
    key: "Reports",
  },
];
