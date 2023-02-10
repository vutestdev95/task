import styled from "@emotion/styled";

const Scanner = () => {
  return (
    <Container data-testid="scanner">
      <Title>Introduce all your order’s essential details</Title>
    </Container>
  );
};

const Title = styled.p`
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: justify;
  color: #576f8b;
`;
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

export default Scanner;
