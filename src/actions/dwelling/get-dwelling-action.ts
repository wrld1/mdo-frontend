"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export async function getDwellingAction(dwellingId: number) {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/dwelling/${dwellingId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const dwelling = await response.json();

    return dwelling;
  } catch (error) {
    console.log("[GET_DWELLING]", getErrorMessage(error));
    return null;
  }
}
