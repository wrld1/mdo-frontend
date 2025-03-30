"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface SignUpFormData {
  email?: string;
  phoneNumber?: string;
  password: string;
  repeatPassword: string;
  authType?: "email" | "phone";
}

export async function signUpAction(signUpFormData: SignUpFormData) {
  const { email, phoneNumber, password, authType = "email" } = signUpFormData;

  const requestBody = {
    password,
    authType,
    ...(authType === "email" 
      ? { email } 
      : { phoneNumber })
  };

  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/auth/sign-up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
