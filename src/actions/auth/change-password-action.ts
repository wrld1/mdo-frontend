"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export async function changePasswordAction(
  changePasswordData: ChangePasswordData
) {
  const { oldPassword, newPassword } = changePasswordData;

  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/auth/change-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
