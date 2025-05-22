"use server";

import { getErrorMessage } from "@/lib/utils";
import {
  AddPaymentRequest,
  AddPaymentsResponse,
} from "@/types/interfaces/service-payment";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export async function uploadPayments(
  paymentRequests: AddPaymentRequest[]
): Promise<AddPaymentsResponse | { error: string }> {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/dwelling-services/payments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequests),
        credentials: "include",
      }
    );

    const responseData: AddPaymentsResponse = await response.json();
    return responseData;
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    console.error("[ADD_MASS_PAYMENTS_ACTION]", errorMessage);
    return {
      error: errorMessage,
    };
  }
}
