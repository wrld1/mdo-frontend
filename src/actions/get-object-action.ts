"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export async function getObjectAction(objectId: string) {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/object/${objectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const object = await response.json();

    return object;
  } catch (error) {
    console.log("[GET_OBJECT]", getErrorMessage(error));
    return null;
  }
}
