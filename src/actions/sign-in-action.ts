"use server";

import { decrypt } from "@/lib/auth";
import { getErrorMessage, timestampToDate } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";
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

    const accessPayload = await decrypt(accessToken);
    const refreshPayload = await decrypt(refreshToken, true);

    cookies().set("accessToken", accessToken, {
      httpOnly: true,
      expires: timestampToDate(accessPayload?.exp as number),
    });

    cookies().set("refreshToken", refreshToken, {
      httpOnly: true,
      expires: timestampToDate(refreshPayload?.exp as number),
      sameSite: "lax",
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
