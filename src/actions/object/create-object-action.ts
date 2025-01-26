"use server";

import { getErrorMessage } from "@/lib/utils";
import { ObjectType } from "@/types/types/object";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface CreateObjectFormData {
  address: string;
  type: ObjectType;
  companyId: string;
}

export async function createObjectAction(
  createObjectFormData: CreateObjectFormData
) {
  const { address, type, companyId } = createObjectFormData;

  try {
    const objectResponse = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/object`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          type,
          companyId,
        }),
      }
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
