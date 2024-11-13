"use server";

import { getErrorMessage } from "@/lib/utils";
import { User } from "@/types/interfaces/user";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export async function getUserAction(userId: number) {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/users/${userId}`,
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
    console.log("[GET_USER]", getErrorMessage(error));
    return null;
  }
}
