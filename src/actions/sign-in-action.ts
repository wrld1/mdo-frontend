"use server";

import { fetchWithAutoErrorHandling, getErrorMessage } from "@/lib/utils";
import { cookies } from "next/headers";

interface SignInFormData {
  email: string;
  password: string;
}

export async function signInAction(signInFormData: SignInFormData) {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/auth/sign-in`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInFormData),
      }
    );

    const { accessToken, refreshToken } = await response.json();

    cookies().set("refreshToken", refreshToken, { httpOnly: true });
    cookies().set("accessToken", accessToken, { httpOnly: true });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
