"use server";

import { getErrorMessage } from "@/lib/utils";
import { CompanyStatus, CompanyType } from "@/types/types/company";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface Company {
  id: string;
  name: string;
  code: number;
  type: CompanyType;
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationResponse {
  data: Company[];
  total: number;
  page: number;
  limit: number;
}

export async function getUserCompanies() {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/user-company/companies`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const userCompanies: PaginationResponse = await response.json();
    return userCompanies.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
