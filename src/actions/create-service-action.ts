"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface CreateServiceFormData {
  name: string;
  description: string;
  price: number;
  logo: string;
  objectId?: string;
}

export async function createServiceAction(
  createServiceFormData: CreateServiceFormData
) {
  console.log(createServiceFormData);
  console.log(typeof createServiceFormData.price);
  try {
    const serviceResponse = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/service`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createServiceFormData),
      }
    );
  } catch (error) {
    console.log("[CREATE_SERVICE]", getErrorMessage(error));
    return {
      error: getErrorMessage(error),
    };
  }
}
