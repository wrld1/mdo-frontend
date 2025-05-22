"use server";

import { getErrorMessage } from "@/lib/utils";
import {
  AddPaymentRequest,
  CreateServicePaymentDto,
  AddPaymentsResponse,
} from "@/types/interfaces/service-payment";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export async function addPaymentAction(
  dwellingServiceId: number,
  payload: CreateServicePaymentDto
): Promise<AddPaymentsResponse | { error: string }> {
  console.log("[ADD_PAYMENT_ACTION] Payload:", payload);

  const requestBody: AddPaymentRequest = {
    dwellingServiceId: dwellingServiceId,
    payment: payload,
  };

  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/dwelling-services/payments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      }
    );

    const result = await response.json();

    console.log("[ADD_PAYMENT_ACTION] Result:", result);

    return result;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("[ADD_PAYMENT_ACTION]", errorMessage);
    return {
      error: errorMessage,
    };
  }
}
