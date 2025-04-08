"use server";

import { revalidatePath } from "next/cache";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";
import { getErrorMessage } from "@/lib/utils";

export async function addServiceToDwellingAction(
  serviceId: number,
  dwellingId: number,
  objectId: string
) {
  console.log("typeof dwellingId", typeof dwellingId);
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/dwelling-services`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dwellingId,
          serviceId,
        }),
        credentials: "include",
      }
    );

    revalidatePath(`/dashboard/objects/${objectId}/dwelling/${dwellingId}`);

    return { success: true };
  } catch (error) {
    console.error("[ADD_SERVICE_TO_DWELLING]", getErrorMessage(error));
    return {
      error: true,
      message: getErrorMessage(error),
    };
  }
}
