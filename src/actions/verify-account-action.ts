"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface VerifyAccountData {
  token: string;
}

export async function verifyAccountAction(
  verifyAccountData: VerifyAccountData
) {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/auth/verify`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verifyAccountData),
      }
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
