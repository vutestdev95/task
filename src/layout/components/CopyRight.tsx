import styled from "@emotion/styled";
import { useCallback, useMemo } from "react";
import { useApp } from "../../ApplicationProvider";
import { DEFAULT_COLOR } from "../../utils/variable";

const DEFAULT_IMAGE = "images/e-courier-logo.svg";
interface ICopyRight {
  src?: string;
}
const CopyRight = ({ src }: ICopyRight) => {
  const appConfig = useApp().config;

  const color = useMemo(() => {
    const color = appConfig.Navbar?.Style?.Color || DEFAULT_COLOR;
    return color;
  }, [appConfig.Navbar?.Style]);

  const onError = useCallback(({ currentTarget }) => {
    currentTarget.onerror = null;
    currentTarget.src = DEFAULT_IMAGE;
  }, []);

  return (
    <Wrapper data-testid="copyright" data-color={color}>
      <p>Powered by</p>
      <img src={src || DEFAULT_IMAGE} alt="" onError={onError} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  p {
    color: ${(props: any) => props["data-color"]};
    opacity: 0.6;
    font-size: 13px;
    padding: 0;
    margin: 0;
    line-height: 16px;
  }
`;
export default CopyRight;
