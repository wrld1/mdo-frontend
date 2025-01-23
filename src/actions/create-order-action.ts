"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface CreateOrderFormData {
  name: string;
  description: string;
  objectId: string;
  dwellingId?: number;
  userId: number;
  companyId: string;
  responsibleUserId?: number;
}

export async function createServiceAction(
  createOrderFormData: CreateOrderFormData
) {
  console.log(createOrderFormData);
  try {
    const orderResponse = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createOrderFormData),
      }
    );
  } catch (error) {
    console.log("[CREATE_ORDER]", getErrorMessage(error));
    return {
      error: getErrorMessage(error),
    };
  }
}
