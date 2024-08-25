"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export async function getUserAction(userId: number) {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const { id, email, isVerified } = await response.json();
    return { id, email, isVerified };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
