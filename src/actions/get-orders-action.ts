"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export async function getOrdersAction() {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/order`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const orders = await response.json();

    return orders;
  } catch (error) {
    console.log("[GET_ORDERS]", getErrorMessage(error));
    return {
      error: getErrorMessage(error),
    };
  }
}
