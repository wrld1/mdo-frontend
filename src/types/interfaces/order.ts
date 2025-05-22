import { Dwelling } from "./dwelling";
import { ObjectResponse } from "./object";
import { UserResponse } from "./user";

export interface Order {
  id: string;
  name: string;
  description: string;
  object: ObjectResponse;
  dwelling?: Dwelling;
  createdAt: Date;
  type: OrderType;
  user: UserResponse;
  responsibleUser?: UserResponse;
  price?: number;
  orderStatus: OrderStatus;
}

export type OrderType =
  | "ELECTRICITY"
  | "WATER"
  | "GAS"
  | "ORGANIZATION"
  | "OTHER";

export enum OrderStatus {
  RECEIVED = "RECEIVED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
  BLOCKED = "BLOCKED",
  INVALID = "INVALID",
}
