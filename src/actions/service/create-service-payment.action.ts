"use server";

import { getErrorMessage } from "@/lib/utils";
import {
  AddPaymentsRequestDtoInternal,
  AddPaymentSuccessResponse,
  CreateServicePaymentDto,
} from "@/types/interfaces/service-payment";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export async function addPaymentAction(
  dwellingServiceId: number,
  payload: CreateServicePaymentDto
): Promise<AddPaymentSuccessResponse | { error: string }> {
  console.log("[ADD_PAYMENT_ACTION] Payload:", payload);

  const backendPaymentPayload: CreateServicePaymentDto = {
    ...payload,
    month: payload.month + 1,
  };

  const requestBody: AddPaymentsRequestDtoInternal = {
    dwellingServiceId: dwellingServiceId,
    payments: [backendPaymentPayload],
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

    return result as AddPaymentSuccessResponse;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("[ADD_PAYMENT_ACTION]", errorMessage);
    return {
      error: errorMessage,
    };
  }
}
