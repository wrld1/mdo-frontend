"use server";

import { fetchWithAutoErrorHandling, getErrorMessage } from "@/lib/utils";

interface SignUpFormData {
  email: string;
  password: string;
  repeatPassword: string;
}

export async function signUpAction(signUpFormData: SignUpFormData) {
  const { email, password } = signUpFormData;

  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/auth/sign-up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
