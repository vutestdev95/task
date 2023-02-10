import {
  forwardRef,
  FunctionComponent,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import Avatar, { ReactAvatarProps } from "react-avatar";
import { Button, Dialog } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

const ImageWrapper = styled.div`
  cursor: pointer;
`;

const CustomAvatar = styled(Avatar)`
  border-radius: 6px;
  margin-right: 12px;
  img {
    border-radius: 6px;
  }
`;

const DialogWrapper = styled(Dialog)`
  margin: 0;
  padding: 0;
`;

const DialogBody = styled.div`
  padding: 0;
  margin: 0;
  position: relative;
`;

const CloseButton = styled(Button)`
  padding: 0;
  margin: 0;
  position: absolute;
  top: 12px;
  right: 12px;
`;

interface IImagePreviewModalProps {
  src?: string;
}

interface IImagePreviewModalRefs {
  open: () => void;
  close: () => void;
}

const ImagePreviewModal = forwardRef<
  IImagePreviewModalRefs,
  IImagePreviewModalProps
>(({ src = "" }, ref) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
    }),
    [close, open]
  );

  return (
    <DialogWrapper isOpen={isOpen} onClose={close}>
      <DialogBody className="bp4-dialog-body">
        <img src={src} alt="description" />
        <CloseButton
          icon={IconNames.Cross}
          onClick={close}
          data-testid="close-preview-image-component"
        />
      </DialogBody>
    </DialogWrapper>
  );
});

const Image: FunctionComponent<ReactAvatarProps> = (props) => {
  const refImage = useRef<IImagePreviewModalRefs>(null);

  const openModal = useCallback(() => {
    refImage.current?.open();
  }, []);

  return (
    <>
      <ImageWrapper onClick={openModal} data-testid="image-component">
        <CustomAvatar {...props} />
      </ImageWrapper>
      <ImagePreviewModal ref={refImage} src={props.src} />
    </>
  );
};

export default memo(Image);
