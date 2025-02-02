"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface CreateObjectFormData {
  number: number;
  floor?: number;
  entrance?: number;
  objectId: string;
  userId?: number;
}

export async function createDwellingAction(
  createObjectFormData: CreateObjectFormData
) {
  const { number, floor, entrance, objectId, userId } = createObjectFormData;

  try {
    const objectResponse = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/dwelling`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number,
          floor,
          entrance,
          objectId,
          userId,
        }),
      }
    );
  } catch (error) {
    console.log("[CREATE_DWELLING]", error);
    return {
      error: getErrorMessage(error),
    };
  }
}
