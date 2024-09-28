import { User } from "../interfaces/user";

export const isUser = (user: any): user is User => {
  return user.email !== undefined;
};
