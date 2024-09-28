"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface CreateCompanyFormData {
  companyName: string;
  companyType: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export async function createCompanyAction(
  createCompanyFormData: CreateCompanyFormData
) {
  const { companyName, companyType, email, password } = createCompanyFormData;

  try {
    const userResponse = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/auth/sign-up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          registrationType: "company",
          companyName,
          companyType,
        }),
      }
    );
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
