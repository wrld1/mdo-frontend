"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface ResetPasswordData {
  newPassword: string;
  resetToken: string | null;
}

export async function resetPasswordAction(
  resetPasswordData: ResetPasswordData
) {
  const { newPassword, resetToken } = resetPasswordData;

  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/auth/reset-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetToken, newPassword }),
      }
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
