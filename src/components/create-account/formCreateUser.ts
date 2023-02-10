export const optionsSecurity = [
  { label: "In what city were you born?", value: "1" },
  { label: "What’s your favorite movie?", value: "2" },
  { label: "What was your first car?", value: "3" },
  { label: "What is your pet's name? ", value: "4" },
  { label: "What is your favorite color?", value: "5" },
  { label: "What is your favorite team?", value: "6" },
  { label: "What is your favorite movie?", value: "7" },
];
export const FormCreateUser = [
  [
    {
      key: "FirstName",
      dataTestid: "create-user-first-name",
      label: "First name",
      placeholder: "e.g. John",
      scaleSpan: 9,
    },
    {
      key: "MiddleInital",
      dataTestid: "create-user-middle-initial",
      label: "Middle initial",
      placeholder: "e.g. L",
      scaleSpan: 6,
    },
    {
      key: "LastName",
      dataTestid: "create-user-last-name",
      label: "Last name",
      placeholder: "e.g. Smith",
      scaleSpan: 9,
    },
  ],
  [
    {
      key: "Username",
      dataTestid: "create-user-username",
      label: "Username",
      placeholder: "e.g. John Smith",
      labelQuestionMark: "Username",
      scaleSpan: 24,
    },
  ],
  [
    {
      key: "Password",
      dataTestid: "create-user-password",
      label: "Password",
      placeholder: "Type your password",
      type: "inputPassword",
      subTitle:
        "Password must be 6-20 characters and different from your username",
    },
    {
      key: "RepeatPassword",
      dataTestid: "create-user-repeat-password",
      label: "Repeat password",
      placeholder: "Type your password",
      type: "inputPassword",
    },
  ],
  [
    {
      key: "SecurityQuestion",
      dataTestid: "create-user-security-question",
      label: "Security question",
      placeholder: "Select a question",
      options: optionsSecurity,
      type: "selection",
      labelQuestionMark: "Security question",
    },
    {
      key: "SecurityAnswer",
      dataTestid: "create-user-your-answer",
      label: "Your answer",
      placeholder: "Answer the question",
    },
  ],
  [
    {
      key: "Phone",
      dataTestid: "create-user-phone",
      label: "Phone",
      placeholder: "e.g. 281-259-2402",
    },
    {
      key: "Email",
      dataTestid: "create-user-email",
      label: "Email",
      placeholder: "e.g. john@example.com",
    },
  ],
  [
    {
      key: "EmailPromotion",
      dataTestid: "create-user-checkbox-default-sign-up-promotions",
      label: "Sign up for exclusive email promotions",
      placeholder: "",
      type: "checkbox",
      scaleSpan: 24,
    },
  ],
];
