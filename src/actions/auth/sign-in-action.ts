"use server";

import { decrypt } from "@/lib/auth";
import { getErrorMessage, timestampToDate } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";
import { cookies } from "next/headers";

interface SignInFormData {
  email?: string;
  phoneNumber?: string;
  password: string;
  authType: "email" | "phone";
}

export async function signInAction(signInFormData: SignInFormData) {
  try {
    const { email, phoneNumber, password, authType } = signInFormData;

    const identifier = authType === "email" ? email : phoneNumber;

    const requestBody = {
      identifier,
      password,
      authType,
    };

    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/auth/sign-in`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const responseData = await response.json();

    if (authType === "email" && responseData.accessToken && responseData.refreshToken) {
      const { accessToken, refreshToken } = responseData;
      
      const accessPayload = await decrypt(accessToken);
      const refreshPayload = await decrypt(refreshToken);
      
      cookies().set("accessToken", accessToken, {
        httpOnly: true,
        expires: timestampToDate(accessPayload?.exp as number),
      });
      
      cookies().set("refreshToken", refreshToken, {
        httpOnly: true,
        expires: timestampToDate(refreshPayload?.exp as number),
        sameSite: "lax",
      });
      
      return { success: true };
    } 
    else if (authType === "phone" && responseData.success) {
      return { 
        success: true, 
        otpSent: true,
        userId: responseData.userId,
        message: responseData.message
      };
    }
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
