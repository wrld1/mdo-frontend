// filepath: c:\Users\kir26\Desktop\mdo\mdo-frontend\src\actions\dwelling-service\add-payment-action.ts
"use server";

import { getErrorMessage } from "@/lib/utils";
import { PaymentStatus } from "@/types/enums/paymentStatus";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";
import { revalidatePath } from "next/cache";

export interface CreateServicePaymentDto {
  startDate: string;
  endDate: string;
  amount: number;
  counter: number;
  status?: PaymentStatus;
}

export interface ServicePaymentResponse {
  id: number;
  startDate: string;
  endDate: string;
  amount: number;
  counter: number;
  status: PaymentStatus;
  dwellingServiceId: number;
  createdAt: string;
  updatedAt: string;
}

export async function addPaymentAction(
  dwellingServiceId: number,
  payload: CreateServicePaymentDto
): Promise<ServicePaymentResponse | { error: string }> {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/dwelling-services/${dwellingServiceId}/payments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );

    const newPayment = await response.json();

    return newPayment;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("[ADD_PAYMENT_ACTION]", errorMessage);
    return {
      error: errorMessage,
    };
  }
}
