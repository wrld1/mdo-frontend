"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface CreateServiceFormData {
  name: string;
  description: string;
  price: string;
  logo: string;
  objectId?: string;
}

export async function createServiceAction(
  createObjectFormData: CreateServiceFormData
) {
  console.log(createObjectFormData);
  console.log(typeof createObjectFormData.price);
  try {
    const serviceResponse = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/service`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createObjectFormData),
      }
    );
  } catch (error) {
    console.log("[CREATE_SERVICE]", getErrorMessage(error));
    return {
      error: getErrorMessage(error),
    };
  }
}
