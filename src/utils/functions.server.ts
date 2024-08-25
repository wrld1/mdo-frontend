"use server";

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
