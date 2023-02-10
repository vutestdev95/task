import { Dialog } from "@blueprintjs/core";
import styled from "@emotion/styled";
import React, { useCallback, useMemo } from "react";
import { ISearchOrderParams } from "../../hooks/apiHooks/useSearchOrder";
import { useIsMobile } from "../../hooks/useIsMobile";
import { SVGCloseModalIcon } from "../../svgs/Svg";
import { SVGPlus } from "../../svgs/SVGPlus";
import { useAuth } from "../AuthProvider";
import { bps } from "../common/Constants";
import {
  CustomButtonPrimary,
  CustomButtonSecondary,
} from "../common/CustomButton";
import { Img } from "../common/Img";
import { Input } from "../common/Input";
import { IOption, Select } from "../common/Select";
import { IAdvancedSearchData, inititalAdvancedData } from "./SearchOrder";

interface DialogAdvancedSearchProps {
  children?: Element;
  isOpen: boolean;
  onClose?: () => void;
  advancedData: IAdvancedSearchData;
  setAdvancedData?: React.Dispatch<React.SetStateAction<IAdvancedSearchData>>;
  setParams?: React.Dispatch<React.SetStateAction<ISearchOrderParams | null>>;
}

const DialogAdvancedSearch: React.FC<DialogAdvancedSearchProps> = ({
  isOpen,
  onClose,
  advancedData,
  setAdvancedData,
  setParams,
}) => {
  const {
    address,
    clientCode,
    jobStatus,
    layout,
    locationType,
    packageSize,
    packageType,
    pieceReference,
    referenceNumber,
    requestorName,
    serviceType,
    supplierAccountID,
  } = advancedData;

  const {
    state: { user },
  } = useAuth();

  const PackageTypes: IOption = useMemo(() => {
    const result = (user?.PackageTypes || []).map((item) => {
      const { PackageValue, PackageName } = item!;
      return {
        label: PackageName,
        value: PackageValue,
      };
    });
    return result;
  }, [user?.PackageTypes]);

  const ServiceTypes: IOption = useMemo(() => {
    const result = (user?.ServiceTypes || []).map((item) => {
      const { ServiceValue, ServiceName } = item!;
      return {
        label: ServiceName,
        value: ServiceValue,
      };
    });
    return result;
  }, [user?.ServiceTypes]);

  const isMobile = useIsMobile({ breakpoint: bps.sm });
  const updateAdvancedData = useCallback(
    (key: keyof IAdvancedSearchData, value: string) => {
      setAdvancedData && setAdvancedData((prev) => ({ ...prev, [key]: value }));
    },
    [setAdvancedData]
  );

  const updateReferenceNumber = useCallback(
    (e: any) => {
      updateAdvancedData(
        "referenceNumber",
        typeof e === "object" ? e.target.value : e
      );
    },
    [updateAdvancedData]
  );
  const updateAddress = useCallback(
    (e: any) => {
      updateAdvancedData("address", typeof e === "object" ? e.target.value : e);
    },
    [updateAdvancedData]
  );
  const updateClientCode = useCallback(
    (e: any) => {
      updateAdvancedData(
        "clientCode",
        typeof e === "object" ? e.target.value : e
      );
    },
    [updateAdvancedData]
  );
  const updateSupplierAccount = useCallback(
    (e: any) => {
      updateAdvancedData(
        "supplierAccountID",
        typeof e === "object" ? e.target.value : e
      );
    },
    [updateAdvancedData]
  );
  const updateRequestorName = useCallback(
    (e: any) => {
      updateAdvancedData(
        "requestorName",
        typeof e === "object" ? e.target.value : e
      );
    },
    [updateAdvancedData]
  );
  const updatePieceReference = useCallback(
    (e: any) => {
      updateAdvancedData(
        "pieceReference",
        typeof e === "object" ? e.target.value : e
      );
    },
    [updateAdvancedData]
  );
  const updateJobStatus = useCallback(
    (e: any) => {
      updateAdvancedData(
        "jobStatus",
        typeof e === "object" ? e.target.value : e
      );
    },
    [updateAdvancedData]
  );
  const updateServiceType = useCallback(
    (e: any) => {
      updateAdvancedData(
        "serviceType",
        typeof e === "object" ? e.target.value : e
      );
    },
    [updateAdvancedData]
  );
  const updatePackageType = useCallback(
    (e: any) => {
      updateAdvancedData(
        "packageType",
        typeof e === "object" ? e.target.value : e
      );
    },
    [updateAdvancedData]
  );
  const updatePackageSize = useCallback(
    (e: any) => {
      updateAdvancedData(
        "packageSize",
        typeof e === "object" ? e.target.value : e
      );
    },
    [updateAdvancedData]
  );
  const updateLayout = useCallback(
    (e: any) => {
      updateAdvancedData("layout", typeof e === "object" ? e.target.value : e);
    },
    [updateAdvancedData]
  );
  const updateLocationType = useCallback(
    (e: any) => {
      updateAdvancedData(
        "locationType",
        typeof e === "object" ? e.target.value : e
      );
    },
    [updateAdvancedData]
  );

  const reset = useCallback(() => {
    setAdvancedData && setAdvancedData(inititalAdvancedData);
  }, [setAdvancedData]);

  const showResults = useCallback(() => {
    setParams &&
      setParams({
        OrderNumber: advancedData.referenceNumber,
        Address: advancedData.address,
        CreateUserName: advancedData.requestorName,
        CustomerCode: advancedData.clientCode,
        Layout: advancedData.layout,
        LocationTypeID: advancedData.locationType,
        OrderStatus: advancedData.jobStatus,
        PackageSize: advancedData.packageSize,
        PackageTypeID: advancedData.packageType,
        Reference: advancedData.pieceReference,
        Service: advancedData.serviceType,
        SupplierAccountID: advancedData.supplierAccountID,
      });
    onClose && onClose();
  }, [setParams, onClose, advancedData]);

  return (
    <StyledDialog onClose={onClose} isOpen={isOpen}>
      <div>
        <Header>
          <TitleContainer>
            {isMobile && (
              <Img
                data-testid="btn-back"
                width="32"
                height="32"
                alt="close"
                src={process.env.PUBLIC_URL + "/images/tracking/ Back@3x.webp"}
                className="mr-1"
              />
            )}

            <Title data-testid="title-modal-advanced-search">
              Advanced {isMobile ? "" : "Search"}
            </Title>

            <ResetFilterContainer>
              <CustomButtonSecondary
                data-testid="reset_filter_btn"
                width={"auto"}
                blackOrBlue="blue"
                largeOrSmallText={isMobile ? "large" : "small"}
                text={isMobile ? "Reset" : "Reset filters"}
                onClick={reset}
              />

              <VerticalLine />
              <SVGCloseModalIcon
                data-testid="btn-close-advanced-search-dialog"
                onClick={onClose}
              />
            </ResetFilterContainer>
          </TitleContainer>
        </Header>
        <Middle>
          {/* service section */}
          <SectionContainer>
            <div>
              <TitleSection>Service</TitleSection>
            </div>

            <Grid2Columns>
              <Select
                error={""}
                label="Job status"
                name="job-status"
                placeholder="Select job status"
                value={jobStatus}
                onChange={updateJobStatus}
                options={[
                  {
                    label: "All",
                    value: "All",
                  },
                  {
                    label: "Active",
                    value: "Active",
                  },
                ]}
              />

              <Select
                error={""}
                label="Service type"
                name="service-type"
                placeholder="Select Service type"
                value={serviceType}
                onChange={updateServiceType}
                options={ServiceTypes}
              />

              <Select
                error={""}
                label="Package type"
                name="package-type"
                placeholder="Select Package type"
                value={packageType}
                onChange={updatePackageType}
                options={PackageTypes}
              />

              <Select
                error={""}
                label="Package size"
                name="package-size"
                placeholder="Select Package size"
                value={packageSize}
                onChange={updatePackageSize}
                options={[
                  { label: "Medium", value: "Medium" },
                  { label: "Big", value: "Big" },
                ]}
              />
            </Grid2Columns>
          </SectionContainer>
          {/* service section */}

          <Line />
          {/* identification section */}
          <SectionContainer>
            <div>
              <TitleSection>Identification</TitleSection>

              <ReferenceNumberContainer>
                <Input
                  dataTestid="reference_number"
                  name="reference_number"
                  label="Reference number"
                  placeholder="e.g. 309813"
                  error=""
                  value={referenceNumber}
                  onChange={updateReferenceNumber}
                />

                <SVGPlus />
              </ReferenceNumberContainer>

              <Grid2Columns>
                <Input
                  name="supplier_account_id"
                  label="Supplier's account ID"
                  placeholder="e.g. Packages Inc"
                  error=""
                  value={supplierAccountID}
                  onChange={updateSupplierAccount}
                />

                <Input
                  name="client_code"
                  label="Client code"
                  placeholder="e.g. J98DFL"
                  error=""
                  value={clientCode}
                  onChange={updateClientCode}
                />

                <Input
                  name="requestor_name"
                  label="Requestor name"
                  placeholder="e.g. John Smith"
                  error=""
                  value={requestorName}
                  onChange={updateRequestorName}
                />

                <Input
                  name="piece_reference"
                  label="Piece Reference"
                  placeholder="e.g. 3"
                  error=""
                  value={pieceReference}
                  onChange={updatePieceReference}
                />
              </Grid2Columns>
            </div>
          </SectionContainer>

          {/* identification section */}

          <Line />

          {/* location section */}
          <SectionContainer>
            <div>
              <TitleSection>Location</TitleSection>
              <Input
                name="address"
                label="Address"
                placeholder="Enter the address"
                error=""
                value={address}
                onChange={updateAddress}
              />
              <div style={{ height: "16px" }} />
              <Grid2Columns>
                <Select
                  error={""}
                  label="Location type"
                  name="location_type"
                  placeholder="Select location type"
                  value={locationType}
                  onChange={updateLocationType}
                  options={[
                    { label: "Business", value: "Business" },
                    { label: "Residence", value: "Residence" },
                    { label: "Unassigned", value: "Unassigned" },
                  ]}
                />

                <Select
                  error={""}
                  label="Layout"
                  name="layout"
                  placeholder="Select layout"
                  value={layout}
                  onChange={updateLayout}
                  options={[
                    { label: "Default", value: "Default" },
                    { label: "Dispatch route", value: "Dispatch route" },
                    { label: "Inbound Pieces", value: "Inbound Pieces" },
                  ]}
                />
              </Grid2Columns>
            </div>
          </SectionContainer>
          {/* location section */}
        </Middle>

        <Footer>
          <ButtonsFooterContainer>
            {!isMobile && (
              <CustomButtonSecondary
                text="Cancel"
                blackOrBlue="black"
                largeOrSmallText="large"
                width="auto"
                onClick={onClose}
              />
            )}
            <CustomButtonPrimary
              data-testid="btn_show_results"
              onClick={showResults}
              width={isMobile ? "100%" : "auto"}
              {...{
                text: "Show results",
              }}
            />
          </ButtonsFooterContainer>
        </Footer>
      </div>
    </StyledDialog>
  );
};

export { DialogAdvancedSearch };

const StyledDialog = styled(Dialog)`
  &.bp4-dialog {
    padding-bottom: 0px;
    width: 552px;
    max-width: 100vw;
    background: #fff;
    margin: 0;
    max-height: 100vh;
    border-radius: 0;
  }
  @media (min-width: ${bps["sm"]}px) {
    &.bp4-dialog {
      border-radius: 6px;
    }
  }
  @media (min-width: ${bps["md"]}px) {
  }
  @media (min-width: ${bps["lg"]}px) {
  }
  @media (min-width: ${bps["xl"]}px) {
  }
  @media (min-width: ${bps["2xl"]}px) {
  }
`;

const TitleSection = styled.h5`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.11;
  letter-spacing: normal;
  text-align: justify;
  color: #102a47;
  margin-bottom: 16px;
}
`;

const Line = styled.div`
  height: 1px;
  background-color: #cbd0df;
  margin: 24px 0px;

  @media (min-width: ${bps["sm"]}px) {
    margin: 24px 30px;
  }
  @media (min-width: ${bps["md"]}px) {
  }
  @media (min-width: ${bps["lg"]}px) {
  }
  @media (min-width: ${bps["xl"]}px) {
  }
  @media (min-width: ${bps["2xl"]}px) {
  }
`;

const Grid2Columns = styled.div`
  display: grid;

  column-gap: 16px;
  row-gap: 16px;

  grid-template-columns: 1fr;
  @media (min-width: ${bps["sm"]}px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: ${bps["md"]}px) {
  }
  @media (min-width: ${bps["lg"]}px) {
  }
  @media (min-width: ${bps["xl"]}px) {
  }
  @media (min-width: ${bps["2xl"]}px) {
  }
`;

const Header = styled.div`
  height: 64px;
  padding: 16px;
  @media (min-width: ${bps["sm"]}px) {
    padding: 16px 20px;
  }
  @media (min-width: ${bps["md"]}px) {
  }
  @media (min-width: ${bps["lg"]}px) {
  }
  @media (min-width: ${bps["xl"]}px) {
  }
  @media (min-width: ${bps["2xl"]}px) {
  }
`;

const Middle = styled.div`
  width: 100%;
  height: calc(100vh - 136px);
  overflow-y: auto;
  padding-top: 8px;
  padding-bottom: 15px;

  @media (min-width: ${bps["sm"]}px) {
    padding-bottom: 24px;
  }
  @media (min-width: ${bps["md"]}px) {
  }
  @media (min-width: ${bps["lg"]}px) {
  }
  @media (min-width: ${bps["xl"]}px) {
  }
  @media (min-width: ${bps["2xl"]}px) {
  }
`;

const Footer = styled.div`
  width: 100%;
  height: 72px;
  padding: 16px 15px;
  position: relative;
  z-index: 1;
  box-shadow: 0 -2px 6px 0 rgba(44, 58, 110, 0.1), 0 -1px 0 0 #cbd0df;

  @media (min-width: ${bps["sm"]}px) {
    padding: 16px 24px;
    box-shadow: 0 -2px 1px 0 rgba(44, 58, 110, 0.06), 0 -1px 0 0 #cbd0df;
  }
  @media (min-width: ${bps["md"]}px) {
  }
  @media (min-width: ${bps["lg"]}px) {
  }
  @media (min-width: ${bps["xl"]}px) {
  }
  @media (min-width: ${bps["2xl"]}px) {
  }
`;

const SectionContainer = styled.div`
  padding-left: 15px;
  padding-right: 15px;

  @media (min-width: ${bps["sm"]}px) {
    padding-left: 24px;
    padding-right: 24px;
  }
  @media (min-width: ${bps["md"]}px) {
  }
  @media (min-width: ${bps["lg"]}px) {
  }
  @media (min-width: ${bps["xl"]}px) {
  }
  @media (min-width: ${bps["2xl"]}px) {
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h4`
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #102a47;

  flex-grow: 1;
  @media (min-width: ${bps["sm"]}px) {
    margin-top: 8px;
  }
  @media (min-width: ${bps["md"]}px) {
  }
  @media (min-width: ${bps["lg"]}px) {
  }
  @media (min-width: ${bps["xl"]}px) {
  }
  @media (min-width: ${bps["2xl"]}px) {
  }
`;

const ResetFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 0;
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 32px;
  margin-left: 8px;
  margin-right: 8px;
  background-color: #cbd0df;
`;

const ReferenceNumberContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 32px;
  column-gap: 8px;
  margin-bottom: 16px;
  align-items: end;
`;

const ButtonsFooterContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 16px;
`;
