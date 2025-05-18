"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";
import { revalidatePath } from "next/cache";

interface CreateServicePaymentDetailsDto {
  startDate: string;
  endDate: string;
  amount?: number;
  counter: number;
  status?: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
}

export interface UploadPaymentPayload {
  dwellingId: number;
  serviceId: number;
  paymentDetails: CreateServicePaymentDetailsDto;
}

interface ProcessResult {
  success: boolean;
  processedCount: number;
  errors?: { dwellingId: number; serviceId: number; error: string }[];
  overallError?: string;
}

export async function processUploadedPaymentsAction(
  payloads: UploadPaymentPayload[]
): Promise<ProcessResult> {
  let processedCount = 0;
  const errors: { dwellingId: number; serviceId: number; error: string }[] = [];

  if (!process.env.API_BASE_URL) {
    return {
      success: false,
      processedCount: 0,
      overallError: "API base URL is not configured.",
    };
  }

  for (const payload of payloads) {
    try {
      const response = await fetchWithAutoErrorHandling(
        `${process.env.API_BASE_URL}/dwelling-services/upload-payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      processedCount++;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(
        `Error processing payment for dwellingId ${payload.dwellingId}, serviceId ${payload.serviceId}:`,
        errorMessage
      );
      errors.push({
        dwellingId: payload.dwellingId,
        serviceId: payload.serviceId,
        error: errorMessage,
      });
    }
  }

  if (errors.length === payloads.length && payloads.length > 0) {
    return {
      success: false,
      processedCount,
      errors,
      overallError: "Усі записи не вдалося обробити.",
    };
  }

  if (processedCount > 0) {
    revalidatePath("/dashboard", "layout");
  }

  return {
    success: errors.length === 0 || processedCount > 0,
    processedCount,
    errors: errors.length > 0 ? errors : undefined,
  };
}
