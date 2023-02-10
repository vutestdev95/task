export const SendOptions = [
  {
    label: "E-mail",
    value: 1,
  },
  {
    label: "Text message",
    value: 2,
  },
];

export const NotificationItem = [
  {
    key: "Email",
    dataTestid: "notification-input-email-",
    label: "Send",
    placeholder: "",
    type: "selection",
    options: SendOptions,
    value: SendOptions[0].label,
  },
  {
    key: "TextMessage",
    dataTestid: "notification-input-text-message",
    label: "To",
    placeholder: "Add a text message",
    scaleSpan: 9,
  },
  {
    key: "NotifyEvents",
    dataTestid: "notification-select-notify-event-",
    label: "When shipment is",
    placeholder: "Notify Events",
    type: "selection",
    options: [],
  },
];
