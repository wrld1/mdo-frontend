"use server";

import { decrypt } from "@/lib/auth";
import { getErrorMessage, timestampToDate } from "@/lib/utils";
import { cookies } from "next/headers";

interface VerifyOtpData {
  userId: number;
  otpCode: string;
}

export async function verifyOtpAction(verifyOtpData: VerifyOtpData) {
  try {
    const { userId, otpCode } = verifyOtpData;

    const response = await fetch(`${process.env.API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, otpCode }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Failed to verify OTP" };
    }

    const { accessToken, refreshToken } = await response.json();

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
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}