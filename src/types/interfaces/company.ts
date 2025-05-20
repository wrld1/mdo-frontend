import {
  CompanyAccessLevel,
  CompanyStatus,
  CompanyType,
} from "../types/company";
import { ObjectResponse } from "./object";
import { UserResponse } from "./user";

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: CompanyStatus;
  code: number;
  type: CompanyType;
  createdAt: Date | string;
  updatedAt: Date | string;
  objects?: ObjectResponse[];
  users?: UserResponse[];
}

export interface CompanyWithAccess {
  company: Company;
  accessLevel: CompanyAccessLevel;
}
