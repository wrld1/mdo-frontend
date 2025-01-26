import {
  CompanyAccessLevel,
  CompanyStatus,
  CompanyType,
} from "../types/company";

export interface Company {
  id: string;
  name: string;
  status: CompanyStatus;
  code: number;
  type: CompanyType;
  createdAt: Date | string;
}

export interface CompanyWithAccess {
  company: Company;
  accessLevel: CompanyAccessLevel;
}
