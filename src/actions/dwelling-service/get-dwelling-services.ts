"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export async function getDwellingServicesAction(dwellingId?: number) {
  try {
    const url = dwellingId
      ? `${process.env.API_BASE_URL}/dwelling-services/dwelling/${dwellingId}`
      : `${process.env.API_BASE_URL}/dwelling-services`;

    const response = await fetchWithAutoErrorHandling(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const dwellingServices = await response.json();

    return dwellingServices;
  } catch (error) {
    console.error("[GET_DWELLING_SERVICES]", getErrorMessage(error));
    return {
      error: getErrorMessage(error),
    };
  }
}
