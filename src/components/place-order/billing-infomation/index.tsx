import { Collapse } from "@blueprintjs/core";
import styled from "@emotion/styled";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { Select } from "../../common/Select";
import { IBillingInfomation } from "./index.type";

const options = [{ value: "Bill me (Invoice)", label: "Bill me (Invoice)" }];

const BillingInfomation = ({ register }: IBillingInfomation) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(true);
  const handleEdit = useCallback(() => {
    setIsEdit((prev) => !prev);
  }, [setIsEdit]);
  const handleToogle = useCallback(() => {
    setIsOpen((prev) => {
      return !prev;
    });
  }, [setIsOpen]);

  return (
    <Container data-testid="billing">
      <HeadContent>
        <TitleHeader>Billing Information</TitleHeader>
        <ButtonGroup>
          <ButtonSaveEditClear onClick={handleEdit} data-testid="btn-edit">
            {isEdit ? "Save" : "Edit"}
          </ButtonSaveEditClear>
          <img src="images/line.svg" alt="line" />
          <svg
            onClick={handleToogle}
            data-testid="toogle-expand"
            className={clsx(
              ` transform duration-200 cursor-pointer hover:bg-slate-100 rounded translate-x-[8px]`,
              isOpen ? " rotate-0 " : " rotate-180"
            )}
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.3956 12.7003C15.751 12.4335 16.2399 12.4332 16.5956 12.6997L20.5997 15.6997C21.0417 16.0309 21.1315 16.6576 20.8004 17.0996C20.4692 17.5416 19.8424 17.6314 19.4005 17.3003L15.9966 14.75L12.6005 17.2997C12.1588 17.6313 11.5319 17.5421 11.2004 17.1004C10.8688 16.6587 10.958 16.0319 11.3997 15.7003L15.3956 12.7003Z"
              fill="#102A47"
            />
          </svg>{" "}
        </ButtonGroup>
      </HeadContent>

      <Collapse isOpen={isOpen} keepChildrenMounted={true}>
        <Content>
          <CardFullWidth>
            {!isEdit && <Title>Payment options</Title>}
            {isEdit ? (
              <Select
                nominwidth
                {...register("paymentOpitions")}
                options={options}
                value={options[0].value}
                label={"Payment method"}
                placeholder={""}
                error={""}
              />
            ) : (
              <Label>{options[0].value}</Label>
            )}
          </CardFullWidth>
        </Content>
      </Collapse>
    </Container>
  );
};

const Container = styled.div`
  padding: 16px 16px 24px 24px;
  border-radius: 6px;
  box-shadow: 0 2px 1px 0 rgba(44, 58, 110, 0.06);
  border: solid 1px #cbd0df;
  background-color: #fff;
  @media only screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const CardFullWidth = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeadContent = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
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
export const ButtonSaveEditClear = styled.div`
  color: #8da4be;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;
  height: 32px;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #f2f4f8;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const Content = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 16px;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #102a47;
  margin-top: 4px;
`;
const Label = styled.div`
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #102a47;
`;

export default BillingInfomation;
