import { convertedStatesOption } from "./formPickupAddress";

export const FormRegisterUser = [
  [
    {
      key: "Username",
      dataTestid: "register-user-username",
      label: "Username",
      placeholder: "e.g. John Smith",
      labelQuestionMark: "Username",
      isRequired: true,
    },
    {
      key: "Displayname",
      dataTestid: "register-user-displayname",
      label: "Display name",
      placeholder: "e.g. John Smith",
      labelQuestionMark: "Display name",
      isRequired: true,
    },
  ],
  [
    {
      key: "Password",
      dataTestid: "register-user-password",
      label: "Password",
      placeholder: "Type your password",
      type: "inputPassword",
      subTitle:
        "Password must be 6-20 characters and different from your username",
      isRequired: true,
    },
    {
      key: "RepeatPassword",
      dataTestid: "register-user-repeat-password",
      label: "Repeat password",
      placeholder: "Type your password",
      type: "inputPassword",
      isRequired: true,
    },
  ],
  [
    {
      key: "Phone",
      dataTestid: "register-user-phone",
      label: "Phone",
      placeholder: "e.g. 281-259-2402",
    },
    {
      key: "Email",
      dataTestid: "register-user-email",
      label: "Email",
      placeholder: "e.g. john@example.com",
    },
  ],
  [
    {
      key: "StreetAddress",
      dataTestid: "address-street-address",
      label: "Street address",
      placeholder: "e.g. 2700 Greens Rd",
      type: "input",
      scaleSpan: 24,
      isRequired: true,
    },
  ],
  [
    {
      key: "MoreAddress",
      dataTestid: "address-apartment",
      label: "Apartment, Suite, Building",
      placeholder: "e.g. Door 27, Floor 4",
      value: "",
      type: "input",
      scaleSpan: 24,
    },
  ],
  [
    {
      key: "Country",
      dataTestid: "address-country",
      label: "Country",
      placeholder: "",
      value: "USA",
      type: "input",
      isDisable: true,
    },
    {
      key: "State",
      dataTestid: "address-state",
      options: convertedStatesOption,
      label: "State",
      placeholder: "Choose a state",
      type: "selection",
      scaleSpan: 12,
      isRequired: true,
    },
  ],
  [
    {
      key: "City",
      dataTestid: "address-city",
      label: "City",
      placeholder: "Choose a city",
      value: "",
      scaleSpan: 12,
      isRequired: true,
    },
    {
      key: "PostalCode",
      dataTestid: "address-postal-code",
      label: "Postal Code",
      placeholder: "e.g. SC456",
      value: "",
      type: "input",
      scaleSpan: 12,
      isRequired: true,
    },
  ],
];
