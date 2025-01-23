import { UserResponse } from "./user";

export interface Order {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  status: string;
  responsibleUser?: UserResponse;
}
