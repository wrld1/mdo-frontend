import { Dwelling } from "./dwelling";
import { Object } from "./object";
import { UserResponse } from "./user";

export interface Order {
  id: string;
  name: string;
  description: string;
  object: Object;
  dwelling?: Dwelling;
  createdAt: Date;
  type: OrderType;
  user: UserResponse;
  responsibleUser?: UserResponse;
  price?: number;
  orderStatus: OrderStatus;
}

export type OrderType = "ELECTRICITY" | "WATER" | "GAS" | "OTHER";
export type OrderStatus =
  | "RECEIVED"
  | "IN_PROGRESS"
  | "FINISHED"
  | "BLOCKED"
  | "INVALID";
