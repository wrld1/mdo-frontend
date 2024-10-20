import { CompanyStatus, CompanyType } from "../types/company";

export interface Company {
  id: string;
  name: string;
  status: CompanyStatus;
  code: number;
  type: CompanyType;
  createdAt: Date | string;
}
