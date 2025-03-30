export const passwordValidation = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
);

export const phoneRegex = /^\+?[1-9]\d{1,14}$/;