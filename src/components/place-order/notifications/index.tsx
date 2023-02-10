import { Collapse } from "@blueprintjs/core";
import styled from "@emotion/styled";
import { Col, Row } from "antd";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAuth } from "../../AuthProvider";
import { ButtonSaveEditClear } from "../billing-infomation";
import { NotificationItem } from "./Constants";
import { EditNotification } from "./EditNotification";
import { INotifications } from "./index.type";

const Notifications = ({ data }: INotifications) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(true);
  const [optionsNotify, setOptionsNotify] = useState(NotificationItem);
  const { control } = useForm();
  const { fields, insert, remove } = useFieldArray({
    control,
    name: "notification",
    rules: {
      minLength: {
        value: 1,
        message: "This is required",
      },
    },
  });
  const { user } = useAuth()?.state;

  useEffect(() => {
    if (user?.NotifyEvents) {
      const newValue = user?.NotifyEvents?.map((item) => {
        return {
          value: item?.NotifyValue ?? "",
          label: item?.NotifyName ?? "",
        };
      });
      setOptionsNotify((prev: any) => {
        prev[2].options = newValue;
        return [...prev];
      });
    }
  }, [user]);

  const handleEdit = useCallback(() => {
    setIsEdit((i) => !i);
  }, [setIsEdit]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      return !prev;
    });
  }, [setIsOpen]);

  const insertItem = useCallback(() => {
    insert(fields.length, {});
  }, [insert, fields]);

  const removeItem = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove]
  );

  const { NotifyName = "" }: any =
    user?.NotifyEvents?.find(
      (item) => item?.NotifyValue === user.NotifyMeWhen
    ) ?? {};

  const textMessageLabel = data?.textMessage || <br />;

  const emailLabel = user?.NotifyMeEmail || <br />;

  function renderDefault() {
    return (
      <HeadContent2>
        <Row style={{ flex: 1 }}>
          <Card>
            <Title>E-mail</Title>
            <Col>
              <Label data-testid="notification-email">{emailLabel}</Label>
            </Col>
            <Col>
              <Label data-testid="notification-notify-email">
                {`When shipment is ${NotifyName?.toLowerCase()}`}
              </Label>
            </Col>
          </Card>
          <Card>
            <Title>Text message</Title>
            <Col>
              <Label data-testid="notification-text-message">
                {textMessageLabel}
              </Label>
            </Col>
            <Col>
              <Label data-testid="notification-notify-text-message">
                {`When shipment is ${NotifyName?.toLowerCase()}`}
              </Label>
            </Col>
          </Card>
        </Row>
      </HeadContent2>
    );
  }

  return (
    <Container data-testid="notifications">
      <HeadContent>
        <TitleHeader> Notifications</TitleHeader>
        <ButtonGroup>
          <ButtonSaveEditClear onClick={handleEdit} data-testid="btn-edit">
            {isEdit ? "Save" : "Edit"}
          </ButtonSaveEditClear>
          <img src="images/line.svg" alt="line" />
          <svg
            onClick={toggle}
            data-testid="button-arrow"
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
          {isEdit ? (
            <EditNotification
              removeItem={removeItem}
              insertItem={insertItem}
              control={control}
              fields={fields}
              optionsNotify={optionsNotify}
            />
          ) : (
            renderDefault()
          )}
        </Content>
      </Collapse>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 16px 16px 24px 24px;
  border-radius: 6px;
  box-shadow: 0 2px 1px 0 rgba(44, 58, 110, 0.06);
  border: solid 1px #cbd0df;
  background-color: #fff;
  display: inline-block;
  @media only screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const Card = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 16px;
`;
const HeadContent = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

const HeadContent2 = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  @media only screen and (max-width: 600px) {
    width: 100%;
    display: flex;
    gap: 4px;
    align-items: flex-start;
  }
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
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const Content = styled.div`
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

export default Notifications;
