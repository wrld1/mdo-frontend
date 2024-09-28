"use server";

import { decrypt } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { cookies } from "next/headers";

export async function fetchWithAutoErrorHandling(
  url: string,
  options: RequestInit | undefined
) {
  const token = cookies().get("accessToken")?.value;

  options = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorResponse = await response.json();
    const errorMessage = errorResponse.message || "Unknown error occurred";
    throw new Error(errorMessage);
  }

  return response;
}

export const verifyUser = async () => {
  try {
    const cookieStore = cookies();
    let accessTokenCookie = cookieStore.get("accessToken")?.value;

    if (!accessTokenCookie) {
      return { isAuth: false, userId: null };
    }

    let token = await decrypt(accessTokenCookie);
    const userId = token?.uId as number;

    if (!userId) {
      return { isAuth: false, userId: null };
    }

    return { isAuth: true, userId };
  } catch (error) {
    getErrorMessage(error);
    return { isAuth: false, userId: null };
  }
};
