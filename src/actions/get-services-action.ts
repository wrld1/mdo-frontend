"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export async function getServicesAction(objectId?: string) {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/service`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const services = await response.json();

    return services;
  } catch (error) {
    console.log("[GET_SERVICES]", getErrorMessage(error));
    return null;
  }
}
