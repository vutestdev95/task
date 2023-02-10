/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import styled from "@emotion/styled";
import { memo, useCallback, useEffect, useState } from "react";
import { breakpointToggleSidebar } from "../../components/common/Constants";
import { usePlaceOrder } from "../../components/place-order/PlaceOrderProvider";
import { useGetEzShipMutation } from "../../generated/graphql";
import PopOverContent from "./PopoverContent";

type FillWithEZProps = {
  UserGUID?: string | null;
};

const FillWithEZ = ({ UserGUID = null }: FillWithEZProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [dataEzShip, setDataEzShip] = useState<Array<any>>([]);
  const { setValue } = usePlaceOrder().formState || {};

  const [mutationGetEzShip] = useGetEzShipMutation({
    context: {
      Headers: {
        UserGUID: UserGUID
          ? UserGUID
          : "{0C0DEC81-AC49-4532-A4E7-C1EF6040B9D3}",
      },
    },
  });
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    getEzShip(UserGUID || "{0C0DEC81-AC49-4532-A4E7-C1EF6040B9D3}");
  }, [UserGUID]);

  const getEzShip = async (id?: string) => {
    const data = await mutationGetEzShip({
      variables: {
        input: {
          UserGUID: id || "{0C0DEC81-AC49-4532-A4E7-C1EF6040B9D3}",
        },
      },
    });

    if (data && Array.isArray(data.data?.getEzShip)) {
      setDataEzShip(
        data.data?.getEzShip as {
          EZShipId: string;
        }[]
      );
    }
  };

  const handleSetEzShip = useCallback(
    (id: any) => {
      setValue("SaveEZShip", true);
      setValue("EZShipName", id);
    },
    [setValue]
  );
  const onInteraction = useCallback((state) => setIsOpen(state), [setIsOpen]);

  return (
    <Container data-testid="fill_with_ez">
      <Popover2
        content={
          <ContentPopover data-testid="popover">
            {dataEzShip.map(({ EZShipId }) => (
              <PopOverContent
                data-testid="Popover-test"
                id={EZShipId}
                key={EZShipId}
                handleClose={handleClose}
                handleClick={handleSetEzShip}
              />
            ))}
          </ContentPopover>
        }
        interactionKind="click"
        isOpen={isOpen}
        usePortal={false}
        onInteraction={onInteraction}
        placement="bottom"
      >
        <FlexContainer>
          <Title>Fill with EZ Ship</Title>
          <MobileTitle> EZ Ship</MobileTitle>
          <Icon data-testid="caret_down" icon="caret-down" size={20} />
        </FlexContainer>
      </Popover2>
    </Container>
  );
};

const Container = styled.div`
  .bp4-popover2 .bp4-popover2-arrow {
    display: none;
  }
  .bp4-popover2 .bp4-popover2-content {
    border-radius: 6px;
  }
  .bp4-popover2 {
    border-radius: 6px;
  }
`;
const Title = styled.div`
  height: 24px;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #102a47;
  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    display: none;
  }
`;

const MobileTitle = styled.div`
  font-size: 16px;
  color: #102a47;
  display: none;
  @media only screen and (max-width: ${breakpointToggleSidebar}px) {
    display: block;
  }
`;
const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const ContentPopover = styled.div`
  width: 250px;
  border-radius: 6px;
`;

export default memo(FillWithEZ);
