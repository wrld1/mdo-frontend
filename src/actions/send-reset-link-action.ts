"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface ResetLinkData {
  email: string;
}

export async function sendResetLinkAction(resetLinkData: ResetLinkData) {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/email/send-reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetLinkData),
      }
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
