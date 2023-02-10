import { Dialog } from "@blueprintjs/core";
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import styled from "@emotion/styled";
import { useHistory } from "react-router-dom";

interface ModalConfirmDiscardProps {
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface EventConfirm {
  event: "POP" | "PUSH";
  router: string;
}

export interface ModalConfirmDiscardRefs {
  open: (event?: EventConfirm) => void;
  close: () => void;
}

const ModalConfirmDiscard = forwardRef<
  ModalConfirmDiscardRefs,
  ModalConfirmDiscardProps
>(({ onCancel, onConfirm }, ref) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [event, setEvent] = useState<EventConfirm | null>(null);
  const history = useHistory();

  const open = useCallback(
    (event = null) => {
      setIsOpen(true);
      setEvent(event);
    },
    [setIsOpen]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    if (onCancel) onCancel();
  }, [setIsOpen, onCancel]);

  const confirm = useCallback(() => {
    close();
    if (onConfirm) onConfirm();
    if (event) {
      if (event.event === "POP") history.goBack();
      else {
        history.push(event.router);
      }
    }
  }, [onConfirm, close, history, event]);

  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
    }),
    [open, close]
  );

  return (
    <DialogWrapper isOpen={isOpen} onClose={onCancel}>
      <DialogHeader className="bp4-dialog-header" data-testid="confirm-discard">
        <TitleHeader className="bp4-heading">Discard order</TitleHeader>
        <button
          aria-label="close"
          className="bp4-dialog-close-button bp4-button bp4-minimal bp4-icon-cross"
          onClick={close}
        ></button>
      </DialogHeader>
      <DialogContent className="bp4-dialog-body">
        Are you sure you want to discard this order?
      </DialogContent>
      <div className="bp4-dialog-footer">
        <div className="bp4-dialog-footer-actions">
          <ButtonAction
            type="button"
            onClick={close}
            data-testid="confirm-discard-cancel"
          >
            No
          </ButtonAction>
          <ButtonAction
            type="button"
            aria-label="confirm"
            onClick={confirm}
            data-testid="confirm-discard-ok"
          >
            Yes
          </ButtonAction>
        </div>
      </div>
    </DialogWrapper>
  );
});

const DialogWrapper = styled(Dialog)`
  .bp4-dialog {
    padding: 24px;
  }
`;

const DialogHeader = styled.div`
  background-color: transparent;
  box-shadow: unset;
  margin-top: 14px;
`;

const DialogContent = styled.div`
  max-width: 318px;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: justify;
  color: #000;
  span {
    font-weight: 500;
  }
`;

const ButtonAction = styled.button`
  padding: 10px 24px;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: justify;
  ${(props) =>
    props["aria-label"] === "confirm"
      ? `
        border-radius: 6px;
        box-shadow: 0 2px 1px 0 rgba(44, 58, 110, 0.12);
        border: solid 1px rgba(0, 0, 0, 0.2);
        background-color: #fa545e;
        color: #fff;
    `
      : "color: #102a47;"}
`;

const TitleHeader = styled.div`
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #102a47;
`;

export default memo(ModalConfirmDiscard);
