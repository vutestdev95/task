import { FunctionComponent, memo, useCallback } from "react";
import { Button, H3, H4, H5, Icon, Intent, Tag } from "@blueprintjs/core";
import styled from "@emotion/styled";
import { IconNames } from "@blueprintjs/icons";
import { format } from "date-fns";
import { getStatus, getStopColor } from "./TrackingTabs/StopsTab";
import { isEmpty } from "lodash";
import { useTrackingDetails } from "./Detail";
import { bps } from "../common/Constants";
import TimeIcon from "../../svgs/TimeIcon";
import Image from "../common/Image";
import PrintIcon from "../../svgs/PrintIcon";

const Container = styled.div`
  padding: 24px;
  flex-grow: 0;
  @media (max-width: ${bps["xl"]}px) {
    padding: 0;
    ${(props: any) => (!props["data-tab"] ? "display: none;" : "")}
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  @media (max-width: ${bps["xl"]}px) {
    display: none;
  }
`;

const Info = styled.div`
  display: flex;
`;

const OrderID = styled(H3)`
  font-size: 20px !important;
  line-height: 24px !important;
  text-align: justify;
  color: #102a47;
  margin: auto 4px auto 0px;
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

const Description = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: ${bps["xl"]}px) {
    display: none;
  }
`;

const DescriptionContent = styled.div`
  font-size: 13px;
  line-height: 15px;

  display: flex;
  align-items: center;
  text-align: left;
  color: #576f8b;
`;

const FunctionButton = styled.div`
  text-align: end;
`;

const FunctionButtonItem = styled(Button)`
  border: none !important;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #102a47;

  .bp4-heading {
    font-family: "BasierCircle";
  }
`;

const Activity = styled.div`
  background: #ffffff;
  border: 1px solid #cbd0df;
  border-radius: 6px;
  margin-top: 22px;
  padding: 16px;
  @media (max-width: ${bps["xl"]}px) {
    padding: 0;
    border: 0;
    margin-top: 16px;
  }
`;

const ActivityTitle = styled(H4)`
  color: #102a47;
  font-size: 18px;
  line-height: 20px;
  text-align: justify;
  @media (max-width: ${bps["xl"]}px) {
    display: none;
  }
`;

const ActivityInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ActivityPiecesAddress = styled.div`
  display: flex;
  flex-direction: column;

  .pieces {
    height: 22px;

    b {
      font-weight: 500;
    }
  }

  @media (max-width: ${bps["xl"]}px) {
    .address {
      font-family: BasierCircle;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.25;
      letter-spacing: normal;
      text-align: left;
      color: #0f2e40;
      order: 1;
    }

    .pieces {
      order: 0;
    }
  }
`;

const Address = styled.div`
  display: flex;
  flex-direction: row;
`;

const Piece = styled.p`
  display: inline;
  margin-right: 16px;
  color: #102a47;
`;

export const Typography = styled.p`
  font-size: 13px;
  line-height: 15px;
  color: #576f8b;
  margin-bottom: 4px;
  font-weight: 400;

  @media (max-width: ${bps["xl"]}px) {
    .event {
      font-family: BasierCircle;
      font-size: 16px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.25;
      letter-spacing: normal;
      text-align: left;
      color: #576f8b;
    }
  }
`;

const TypographyDate = styled(Typography)`
  ${(props: any) =>
    props["data-xl"]
      ? `
    @media (max-width: ${bps["xl"]}px) {
      display: none;
    }
  `
      : `
    font-family: BasierCircle;
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: normal;
    text-align: left;
    color: #576f8b;
    margin-bottom: 8px;
    @media (min-width: ${bps["xl"]}px) {
      display: none;
    }
  `}
`;

export const MessageTitle = styled(H5)`
  font-size: 13px !important;
  line-height: 15px !important;
  font-weight: 500 !important;
  display: flex;
  align-items: center;
  text-align: justify;
  color: #102a47;
  margin-bottom: 4px;
  @media (max-width: ${bps["xl"]}px) {
    font-family: BasierCircle;
    font-size: 16px;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: no;
  }
`;

export const MessageContent = styled.div`
  background: #f4f5f7;
  border-radius: 6px;
  padding: 8px 12px 8px 8px;
`;

export const MessageDetail = styled(H5)`
  margin-bottom: 0px;
  font-size: 14px !important;
  color: #0f2e40 !important;
  font-weight: 400 !important;
`;

export const TextButton = styled(H5)`
  margin-bottom: 0px;
  font-family: BasierCircle !important;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25 !important;
  letter-spacing: normal;
  text-align: justify;
  color: #102a47;
`;

export const getOrderStatus = (status: string) => {
  const statusObj: any = {
    N: "New",
    Q: "Sent",
    t: "Machine",
    T: "Driver",
    A: "Accepted",
    C: "Completed",
    I: "Invoiced",
    P: "Paid",
    X: "Deleted",
  };
  return statusObj[status] || "";
};

export const getOrderColor = (status: string) => {
  const statusObj: any = {
    N: Intent.NONE,
    Q: Intent.SUCCESS,
    t: Intent.SUCCESS,
    T: Intent.SUCCESS,
    A: Intent.SUCCESS,
    C: Intent.SUCCESS,
    I: Intent.SUCCESS,
    P: Intent.SUCCESS,
    X: Intent.WARNING,
  };
  return statusObj[status] || "";
};

interface TrackingInfoProps {
  onClose?: () => void;
  reload?: () => void;
  tab?: boolean;
}

const TrackingInfo: FunctionComponent<TrackingInfoProps> = ({
  onClose,
  reload,
  tab = false,
}) => {
  const trackingState = useTrackingDetails();
  const order = trackingState.order;
  const orderEvents = trackingState.orderEvents;
  const stops = trackingState.stops;

  const lastEvent = orderEvents[orderEvents.length - 1] || {};
  const lastStopActivity = stops[stops.length - 1] || { JobStops: [] };

  const address = lastStopActivity["@Address"];
  const city = lastStopActivity["@City"];
  const state = lastStopActivity["@State"];
  const zip = lastStopActivity["@Zip"];
  const tz = lastStopActivity["@ScheduledDateTimeTZ"];

  const jobStopsLastestItem =
    lastStopActivity?.JobStops[lastStopActivity?.JobStops.length - 1] || {};

  const pieces = jobStopsLastestItem?.JobStopPieces?.JobStopPiece || [];

  const type = lastStopActivity["@StopType"];
  const status = jobStopsLastestItem["@JobStopStatus"];

  const eventTitle = lastEvent["@UserName"];

  const orderTimezoneETA = trackingState.timezoneETA;

  const refetch = useCallback(() => {
    if (reload) reload();
  }, [reload]);

  const close = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  return (
    <Container data-testid="tracking-detail" data-tab={tab}>
      <Title>
        <Info>
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
        <CloseIcon
          icon={IconNames.Cross}
          size={32}
          onClick={close}
          data-testid="close-button"
        />
      </Title>
      <Description>
        <DescriptionContent data-testid="tracking-detail-eta">
          <Typography className="bp4-ui-text mr-1.5">ETA</Typography>
          <TimeIcon />
          <Typography className="bp4-ui-text ml-1.5">
            {order["@DueDateTime"] &&
              `${format(
                new Date(order["@DueDateTime"]),
                "MMMM d, Y p "
              )}${orderTimezoneETA}`}
          </Typography>
        </DescriptionContent>
        <FunctionButton>
          <FunctionButtonItem icon={<PrintIcon />} outlined onClick={refetch}>
            <TextButton>Print</TextButton>
          </FunctionButtonItem>
          <FunctionButtonItem
            icon={IconNames.Refresh}
            outlined
            onClick={refetch}
            data-testid="tracking-detail-refresh"
          >
            <TextButton>Refresh</TextButton>
          </FunctionButtonItem>
        </FunctionButton>
      </Description>
      <Activity>
        <ActivityTitle>Latest activity</ActivityTitle>
        <TypographyDate className="bp4-ui-text">
          {lastStopActivity["@ScheduledDateTime"] &&
            `${format(
              new Date(lastStopActivity["@ScheduledDateTime"]),
              "MMMM d, h:mm aaa "
            )}${tz}`}
        </TypographyDate>
        <ActivityInfo>
          <Address>
            <Image
              src="https://s3-alpha-sig.figma.com/img/e60c/2870/7b55caf2d95b9f812f711db24ee5da73?Expires=1672012800&Signature=lcioo43FIsKImdQsXbiX8ePCT1Fr0U4x4GWpSTEwxO6Qh6diohQG~389ZbQgSBfpFe18i4JO4a9D2-tGq7b-9TT0YLaL71TRVqauSSr2uIN~zWweaLCqLnJA0iLP4GgPDczCQU307lDZ6O3sNudsX5ez2svbs0eTpxb3GwftsmjgqquHsBdPE-J9h2tuuKS4JZfd5VI6C6Xj9eIrToWWe2M1JPumplEhP1oueI-5Exqeu6BVTI6Pzobq8Y73DQ40mQMRA8E-Qdk34psUs4Y2Da1tuKUjWuXJsc0e39G6qtHTe3otGCUx6J1-pO28jilxImY9zuKn4NKM4t9peL2bfw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
              size="48"
            />
            <ActivityPiecesAddress>
              <Piece
                data-testid="tracking-detail-latest-activity-address"
                className="address"
              >
                {address}, {city}, {state} {zip}
              </Piece>
              <div
                data-testid="tracking-detail-latest-activity-pieces"
                className="pieces"
              >
                {pieces.map((piece: any) => (
                  <Piece key={piece["@PieceID"]}>
                    <b>Piece #{piece["@PieceID"]}</b>
                  </Piece>
                ))}
                <StatusTag
                  large
                  minimal
                  interactive
                  intent={getStopColor(`${type}.${status}`)}
                  data-testid="tracking-detail-latest-activity-status"
                >
                  {getStatus(`${type}.${status || ""}`)}
                </StatusTag>
              </div>
            </ActivityPiecesAddress>
          </Address>
          <TypographyDate className="bp4-ui-text" data-xl>
            {lastStopActivity["@ScheduledDateTime"] &&
              `${format(
                new Date(lastStopActivity["@ScheduledDateTime"]),
                "MMMM d, h:mm aaa "
              )}${tz}`}
          </TypographyDate>
        </ActivityInfo>
        <MessageTitle>Messages and events</MessageTitle>
        <TypographyDate>
          {lastEvent["@EventDateTime"] &&
            format(new Date(lastEvent["@EventDateTime"]), "MMMM d, hh aaa")}
        </TypographyDate>
        <MessageContent data-testid="tracking-detail-latest-activity-event">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography className="event">
              {lastEvent["@EventType"]}
              {!isEmpty(eventTitle) && " - "}
              {eventTitle}
            </Typography>
            <TypographyDate data-xl>
              {lastEvent["@EventDateTime"] &&
                format(
                  new Date(lastEvent["@EventDateTime"]),
                  "MMMM d, h:mm aaa"
                )}
            </TypographyDate>
          </div>
          <MessageDetail>
            {lastEvent["@Note"]
              ? lastEvent["@Note"]?.replace(/\{[0-9A-Za-z-]+\}/g, "")?.trim()
              : ""}
          </MessageDetail>
        </MessageContent>
      </Activity>
    </Container>
  );
};

export default memo(TrackingInfo);
