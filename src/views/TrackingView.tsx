import styled from "@emotion/styled";
import React, { useCallback, useRef, useState } from "react";
import { bps } from "../components/common/Constants";
import { SearchOrder } from "../components/tracking/SearchOrder";
import MainLayout from "../layout/MainLayout";
import Detail, { DetailRef } from "../components/tracking/Detail";
import { isEmpty } from "lodash";

interface TrackingViewProps {
  children?: Element;
}

const TrackingView: React.FC<TrackingViewProps> = () => {
  const trackingDetailRef = useRef<DetailRef>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [openMobileInfo, setOpenMobileInfo] = useState(false);

  const search = useCallback(
    (orderNumber: string) => {
      if (!isEmpty(orderNumber)) {
        setOpenMobileInfo(true);
        trackingDetailRef.current?.open(orderNumber);
      }
      setOrderNumber(orderNumber);
    },
    [setOrderNumber]
  );

  const close = useCallback(() => {
    setOpenMobileInfo(false);
  }, [setOpenMobileInfo]);

  return (
    <MainLayout>
      <TemplateWrapper data-testid="tracking-view" id="tracking-main-layout">
        <SearchOrderWrapper>
          <SearchOrder setOrderNumber={search} orderNumber={orderNumber} />
        </SearchOrderWrapper>
        <MapContainer
          data-visibility={!openMobileInfo}
          display="block"
          key="detail-tracking"
        >
          <Detail
            orderNumber={orderNumber}
            setOrderNumber={setOrderNumber}
            onClose={close}
            ref={trackingDetailRef}
          />
        </MapContainer>
      </TemplateWrapper>
    </MainLayout>
  );
};

const TemplateWrapper = styled.div`
  display: block;
  height: 100vh;
  position: relative;
  @media (min-width: ${bps["xl"]}px) {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
  }
  @media only screen and (max-width: ${bps["sm"]}px) {
    height: calc(100vh - 56px);
  }
`;

const SearchOrderWrapper = styled.div`
  overflow-x: auto;
  padding: 10px;
  @media (min-width: ${bps["sm"]}px) {
    padding: 16px;
  }
  @media (min-width: ${bps["xl"]}px) {
    padding: 32px;
    min-height: 100vh;
  }
`;

const MapContainer = styled.div<{ display: string }>`
  position: relative;
  overflow-y: hidden;
  display: ${(props) => props.display};
  height: 100%;
  @media (min-width: ${bps["sm"]}px) {
    flex-grow: 1;
  }
  @media (max-width: ${bps["xl"]}px) {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    ${(props: any) => (props["data-visibility"] ? "visibility: hidden;" : "")}
  }
`;

export { TrackingView };
