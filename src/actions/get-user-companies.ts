"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface Company {
  id: string;
  name: string;
  type: "OSBB" | "ManagingCompany" | "CottageTown";
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
    return userCompanies;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
