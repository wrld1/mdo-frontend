// filepath: c:\Users\kir26\Desktop\mdo\mdo-frontend\src\actions\order\update-order-action.ts
"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";
import { Order, OrderStatus } from "@/types/interfaces/order";
import { revalidatePath } from "next/cache";

interface UpdateOrderPayload {
  orderStatus: OrderStatus;
}

export async function updateOrderAction(
  orderId: string,
  payload: UpdateOrderPayload
): Promise<Order | { error: string }> {
  try {
    const response = await fetchWithAutoErrorHandling(
      `${process.env.API_BASE_URL}/order/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );

    const updatedOrder = await response.json();

    revalidatePath("/dashboard/[companyId]/orders", "page");

    return updatedOrder;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("[UPDATE_ORDER_ACTION]", errorMessage);
    return {
      error: errorMessage,
    };
  }
}
