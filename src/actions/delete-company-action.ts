"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface deleteCompanyData {
  id: string;
}

export async function deleteCompanyAction(
  deleteCompanyData: deleteCompanyData
) {
  const { id } = deleteCompanyData;

  try {
    const companyDeleted = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/companies/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
