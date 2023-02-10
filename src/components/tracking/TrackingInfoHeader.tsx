import { FunctionComponent, memo } from "react";
import { H3, H5, Icon, Tag } from "@blueprintjs/core";
import styled from "@emotion/styled";
import { IconNames } from "@blueprintjs/icons";
import { useTrackingDetails } from "./Detail";
import { getOrderColor, getOrderStatus } from "./TrackingInfo";
import BackIcon from "../../svgs/BackIcon";
import { format } from "date-fns";
import { bps } from "../common/Constants";

const Container = styled.div`
  padding: 16px;
  height: 96px;
  background-color: white;
  z-index: 22;
  position: relative;
  @media (min-width: ${bps["xl"]}px) {
    display: none;
  }

  .back-icon {
    cursor: pointer;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const Info = styled.div`
  display: flex;
`;

const OrderID = styled(H3)`
  font-size: 20px;
  line-height: 24px;
  text-align: justify;
  color: #102a47;
  margin: auto 4px auto 10px;
`;

export const StatusTag = styled(Tag)`
  background: rgba(250, 84, 94, 0.1);
  mix-blend-mode: normal;
  border-radius: 4px;
  text-transform: uppercase;
`;

const CloseIcon = styled(Icon)`
  cursor: pointer;
`;

export const Typography = styled.p`
  font-family: BasierCircle;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: right;
  color: #8da4be;
`;

export const MessageTitle = styled(H5)`
  font-size: 13px;
  line-height: 15px;
  display: flex;
  align-items: center;
  text-align: justify;
  color: #102a47;
`;

export const MessageContent = styled.div`
  background: #f4f5f7;
  border-radius: 6px;
  padding: 8px 12px 8px 8px;
`;

export const MessageDetail = styled(H5)`
  margin-bottom: 0px;
`;

const DescriptionContent = styled.div`
  font-size: 13px;
  line-height: 15px;

  display: flex;
  align-items: center;
  text-align: left;
  color: #576f8b;
`;

interface TrackingInfoHeaderProps {
  onClose: () => void;
}

const TrackingInfoHeader: FunctionComponent<TrackingInfoHeaderProps> = ({
  onClose,
}) => {
  const trackingState = useTrackingDetails();
  const order = trackingState.order || {};
  const stops = trackingState.stops || {};
  const lastStopActivity = stops[stops.length - 1] || { JobStops: [] };
  const jobStopsLastestItem =
    lastStopActivity?.JobStops[lastStopActivity?.JobStops.length - 1] || {};
  const status = jobStopsLastestItem["@JobStopStatus"];
  const orderTimezoneETA = trackingState.timezoneETA;
  return (
    <Container data-testid="tracking-detail-mobile">
      <Title>
        <Info>
          <div onClick={onClose} className="back-icon">
            <BackIcon />
          </div>
          <OrderID data-testid="tracking-detail-id">
            Order #{order["@OrderID"]}
          </OrderID>
          <StatusTag
            large
            minimal
            interactive
            intent={getOrderColor(order["@OrderStatus"])}
            data-testid="tracking-detail-status"
          >
            {order["@OrderStatus"] === "I" && status === "C"
              ? "Completed"
              : getOrderStatus(order["@OrderStatus"])}
          </StatusTag>
        </Info>
        <CloseIcon icon={IconNames.More} size={20} data-testid="close-button" />
      </Title>
      <DescriptionContent>
        <Typography className="bp4-ui-text" data-testid="tracking-detail-eta">
          ETA
          <Icon icon={IconNames.Time} style={{ margin: "0 7px" }} />
          {order["@DueDateTime"] &&
            `${format(
              new Date(order["@DueDateTime"]),
              "MMMM d, Y h:mm aaa "
            )}${orderTimezoneETA}`}
        </Typography>
      </DescriptionContent>
    </Container>
  );
};

export default memo(TrackingInfoHeader);
