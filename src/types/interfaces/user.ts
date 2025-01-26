import { FraudStatus } from "../enums/fraudStatus";
import { AclResponse } from "./acl";

export interface UserResponse {
  email: string;
  isVerified: boolean;
  fraudStatus: FraudStatus;
  acl: AclResponse[];
}
