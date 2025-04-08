"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";
import { revalidatePath } from "next/cache";

interface UpdateDwellingParams {
  number?: number;
  floor?: number;
  entrance?: number;
  userId?: number;
}

export async function updateDwellingAction(
  formData: UpdateDwellingParams,
  dwellingId: number,
  objectId: string
) {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/dwelling/${dwellingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: true,
        message: errorData.message || "Failed to update dwelling",
      };
    }

    revalidatePath(`/dashboard/objects/${objectId}/dwellings`);

    return await response.json();
  } catch (error) {
    console.log("[UPDATE_DWELLING]", error);
    return {
      error: getErrorMessage(error),
    };
  }
}
