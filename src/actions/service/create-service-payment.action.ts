// filepath: c:\Users\kir26\Desktop\mdo\mdo-frontend\src\actions\dwelling-service\add-payment-action.ts
"use server";

import { getErrorMessage } from "@/lib/utils";
import { PaymentStatus } from "@/types/enums/paymentStatus";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export interface CreateServicePaymentDto {
  month: number;
  year: number;
  amount?: number;
  counter: number;
  status?: PaymentStatus;
}

interface AddPaymentsRequestDtoInternal {
  dwellingServiceId?: number;
  dwellingId?: number;
  serviceId?: number;
  payments: CreateServicePaymentDto[];
}

export interface AddPaymentSuccessResponse {
  message: string;
  count: number;
}

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
