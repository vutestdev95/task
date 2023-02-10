import styled from "@emotion/styled";
import { Grid } from "antd";
import { isArray } from "lodash";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useGetJsonOrderMutation } from "../../generated/graphql";
import { getArrayFromField } from "../../utils/generals";
import DialogTracking, { DialogTrackingRef } from "./DialogTracking";
import MapInfo, { MapInfoDefault } from "./MapInfo";
import TrackingInfoHeader from "./TrackingInfoHeader";

const useBreakpoint = Grid.useBreakpoint;

export interface DetailRef {
  open: (orderNumber: string) => void;
}

export interface TrackingType {
  order: any;
  loading: boolean;
}

export const TrackingContext = createContext<TrackingType>({
  order: null,
  loading: false,
});

export interface TrackingCustomHook {
  stops: any[];
  orderEvents: any[];
  jobStops: any[];
  timezone: string;
  timezoneETA: string;
}

export const useTrackingDetails = (): TrackingType & TrackingCustomHook => {
  const context = useContext(TrackingContext);

  const jobStops = useMemo(() => {
    let jobStops: any = [];
    if (isArray(context?.order?.Jobs?.Job)) {
      jobStops = context?.order?.Jobs?.Job?.JobStops?.JobStop || [];
      context?.order?.Jobs?.Job?.forEach((item: any) => {
        jobStops.push(...(item?.JobStops?.JobStop || []));
      });
    } else {
      jobStops = context?.order?.Jobs?.Job?.JobStops?.JobStop || [];
    }
    jobStops.sort((a: any, b: any) => {
      const timeA = new Date(a["@ScheduledDateTime"])?.getTime();
      const timeB = new Date(b["@ScheduledDateTime"])?.getTime();
      return timeA - timeB;
    });

    return jobStops.map((jobStop: any) => ({
      ...jobStop,
      JobStopPieces: {
        JobStopPiece: getArrayFromField(jobStop?.JobStopPieces?.JobStopPiece),
      },
    }));
  }, [context.order]);

  const stops = useMemo(() => {
    const mapJobStops = new Map<string, any[]>();
    jobStops.forEach((jobStop: any) => {
      const mapJobStopsItem = mapJobStops.get(jobStop["@StopID"]) || [];
      mapJobStopsItem.push(jobStop);
      mapJobStops.set(jobStop["@StopID"], mapJobStopsItem);
    });
    const stop = context?.order?.Stops?.Stop;
    const stops = getArrayFromField(stop);

    stops.sort((a: any, b: any) => {
      const timeA = new Date(a["@ScheduledDateTime"])?.getTime();
      const timeB = new Date(b["@ScheduledDateTime"])?.getTime();
      return timeA - timeB;
    });

    return stops.map((stop: any) => {
      const jobStops = mapJobStops.get(stop["@StopID"]) || [];
      return {
        ...stop,
        JobStops: jobStops,
      };
    });
  }, [context.order, jobStops]);

  const orderEvents = useMemo(() => {
    const orderEvents = getArrayFromField(
      context?.order?.OrderEvents?.OrderEvent
    );

    orderEvents.sort((a: any, b: any) => {
      const timeA = new Date(a["@EventDateTime"])?.getTime();
      const timeB = new Date(b["@EventDateTime"])?.getTime();
      return timeA - timeB > 0 ? 1 : -1;
    });

    return orderEvents || [];
  }, [context.order]);

  const tz = useMemo(() => {
    const firstStop =
      stops.find((stop: any = {}) => stop["@StopType"] === "P") || {};
    return firstStop["@ScheduledDateTimeTZ"] || "";
  }, [stops]);

  const tzETA = useMemo(() => {
    const firstStop =
      [...stops]
        .reverse()
        .find((stop: any = {}) => stop["@StopType"] === "D") || {};
    return firstStop["@ScheduledDateTimeTZ"] || "";
  }, [stops]);

  return {
    ...context,
    stops,
    orderEvents,
    jobStops,
    timezone: tz,
    timezoneETA: tzETA,
  };
};

interface DetailProps {
  orderNumber: string;
  setOrderNumber?: Function;
  onClose?: Function;
}

const Detail = forwardRef<DetailRef, DetailProps>((props, ref) => {
  const { orderNumber, setOrderNumber } = props;
  const [getOrder, { data, loading }] = useGetJsonOrderMutation({
    fetchPolicy: "network-only",
  });
  const trackingDialogRef = useRef<DialogTrackingRef>(null);
  const { xl } = useBreakpoint();
  const fetchOrder = useCallback(
    (orderNumberInput?: string) => {
      const orderID = orderNumberInput || orderNumber;
      if (orderNumberInput === orderNumber) return;
      if (orderID) {
        getOrder({
          variables: {
            input: {
              OrderNumber: orderID,
            },
          },
        });
      }
    },
    [getOrder, orderNumber]
  );

  const open = useCallback(
    (orderNumber: string) => {
      fetchOrder(orderNumber);
      trackingDialogRef.current?.open();
    },
    [fetchOrder, trackingDialogRef]
  );

  const close = useCallback(() => {
    setOrderNumber && setOrderNumber("");
    if (props.onClose) props.onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onClose]);

  useImperativeHandle(ref, () => ({
    open,
  }));

  const mapHeight = xl ? 0 : 96;

  const value = useMemo(
    () => ({
      order: data?.GetJsonOrder?.Order || {},
      loading,
    }),
    [data?.GetJsonOrder?.Order, loading]
  );

  return (
    <TrackingContext.Provider value={value}>
      <TrackingInfoHeader onClose={close} />
      <MapWrapper
        height={
          !!orderNumber
            ? `calc((100% - ${mapHeight}px)*0.25)`
            : `calc((100% - ${mapHeight}px))`
        }
      >
        <MapContainer hidden={orderNumber ? true : false}>
          <MapInfoDefault />
        </MapContainer>
        <MapContainer hidden={!orderNumber ? true : false}>
          <MapInfo />
        </MapContainer>
      </MapWrapper>
      <DialogTracking
        onClose={close}
        onRefetch={fetchOrder}
        ref={trackingDialogRef}
      />
    </TrackingContext.Provider>
  );
});

export default memo(Detail);

const MapWrapper = styled.div<{ height: string }>`
  height: ${(props) => props.height};
  position: relative;
  z-index: 21;
`;

const MapContainer = styled.div`
  height: 100%;
`;
