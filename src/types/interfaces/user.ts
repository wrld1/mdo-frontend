import { FraudStatus } from "../enums/fraudStatus";
import { AclResponse } from "./acl";

export interface User {
  email: string;
  isVerified: boolean;
}

export interface UserResponse {
  email: string;
  isVerified: boolean;
  fraudStatus: FraudStatus;
  Acl: AclResponse[];
}
