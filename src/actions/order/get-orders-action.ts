"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface GetOrdersParams {
  companyId?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  orderSearch?: string;
  orderType?: string;
}

export async function getOrdersAction(params: GetOrdersParams) {
  try {
    const queryParams = new URLSearchParams({
      ...(params.companyId && { companyId: params.companyId }),
      offset: (params.offset ?? 0).toString(),
      limit: (params.limit ?? 10).toString(),
      sortBy: params.sortBy ?? "id",
      sortOrder: params.sortOrder ?? "asc",
      ...(params.orderSearch && { orderSearch: params.orderSearch }),
      ...(params.orderType && { orderType: params.orderType }),
    });

    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/order?${queryParams}`,
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
