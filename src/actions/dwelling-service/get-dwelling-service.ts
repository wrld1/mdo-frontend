"use server";

import { getErrorMessage } from "@/lib/utils"; // Assuming this utility exists
import { fetchWithAutoErrorHandling } from "@/utils/functions.server"; // Assuming this utility exists

export async function getDwellingServiceByIdAction(id: number) {
  try {
    const url = `${process.env.API_BASE_URL}/dwelling-services/${id}`;

    const response = await fetchWithAutoErrorHandling(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const dwellingService = await response.json();

    return dwellingService;
  } catch (error) {
    console.error(
      `[GET_DWELLING_SERVICE_BY_ID] Error fetching service with ID ${id}:`,
      getErrorMessage(error)
    );
    return {
      error: getErrorMessage(error),
    };
  }
}
