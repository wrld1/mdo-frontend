"use server";

import { getErrorMessage } from "@/lib/utils";
import { OrderType } from "@/types/interfaces/order";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface CreateOrderFormData {
  name: string;
  description: string;
  type: OrderType;
  objectId: string;
  dwellingId?: number;
  userId: number;
  responsibleUserId?: number;
}

export async function createOrderAction(
  createOrderFormData: CreateOrderFormData,
  companyId: string
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
        body: JSON.stringify({ ...createOrderFormData, companyId }),
      }
    );
  } catch (error) {
    console.log("[CREATE_ORDER]", getErrorMessage(error));
    return {
      error: getErrorMessage(error),
    };
  }
}
