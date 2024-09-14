"use server";

import { decrypt, updateAccessToken } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { cookies } from "next/headers";

import { cache } from "react";

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

export const getUser = async () => {
  try {
    let cookie = cookies().get("accessToken")?.value;
    let token = await decrypt(cookie);

    if (!token) {
      const newAccessToken = await updateAccessToken();

      if (newAccessToken) {
        token = await decrypt(newAccessToken);
      }
    }
    const userId = (token?.uId as number) ?? null;

    if (!userId) {
      return { isAuth: false, userId: null };
    }

    return { isAuth: true, userId };
  } catch (error) {
    getErrorMessage(error);
    return { isAuth: false, userId: null };
  }
};
