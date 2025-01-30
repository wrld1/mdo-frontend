"use server";

import { getErrorMessage } from "@/lib/utils";
import { ObjectType } from "@/types/types/object";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";
import { revalidatePath } from "next/cache";

interface UpdateObjectFormData {
  address: string;
  type: ObjectType;
}

export async function updateObjectAction(
  updateObjectFormData: UpdateObjectFormData,
  objectId: string,
  companyId?: string
) {
  const { address, type } = updateObjectFormData;

  try {
    const objectResponse = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/object/${objectId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          type,
        }),
      }
    );
    revalidatePath(`/dashboard/${companyId}/objects`);
    revalidatePath(`/dashboard/${companyId}/objects/${objectId}`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
