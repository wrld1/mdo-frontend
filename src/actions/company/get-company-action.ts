"use server";

import { getErrorMessage } from "@/lib/utils";
import { Company } from "@/types/interfaces/company";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export async function getCompany(companyId: string) {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/companies/${companyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const company: Company = await response.json();
    return company;
  } catch (error) {
    console.log("[GET_COMPANY]", getErrorMessage(error));
    return {
      error: getErrorMessage(error),
    };
  }
}
