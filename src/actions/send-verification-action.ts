"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface SendVerificationData {
  email: string;
}

export async function sendVerificationAction(
  sendVerificationData: SendVerificationData
) {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/auth/verification-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendVerificationData),
      }
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
