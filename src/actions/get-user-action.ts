"use server";

import { getErrorMessage } from "@/lib/utils";
import { User } from "@/types/interfaces/user";
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

    const user: User = await response.json();
    return user;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
