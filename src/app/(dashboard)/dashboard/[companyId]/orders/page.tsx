import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { getOrdersAction } from "@/actions/order/get-orders-action";
import { Order } from "@/types/interfaces/order";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ConfirmButton } from "./_components/ConfirmButton";
import OrderCard from "./_components/OrderCard";
import { isActionError } from "@/types/guards/isActionError";

interface PageProps {
  params: {
    companyId: string;
  };
}

async function OrdersPage({ params }: PageProps) {
  const { companyId } = params;

  const ordersRes = await getOrdersAction({
    companyId,
    limit: 10,
    offset: 0,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (isActionError(ordersRes)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {ordersRes.error}</p>
      </div>
    );
  }

  const ordersData = ordersRes;

  const activeOrders = ordersData.filter(
    (order) => order.orderStatus !== "FINISHED"
  );
  const finishedOrders = ordersData.filter(
    (order) => order.orderStatus === "FINISHED"
  );

  return (
    <div className="flex flex-col gap-8">
      <Button asChild className="mr-auto">
        <Link href={`/dashboard/${companyId}/orders/create`}>
          Створити нову заявку
        </Link>
      </Button>

      {activeOrders.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Заявки в роботі</h2>
          <div className="flex gap-4 flex-wrap">
            {activeOrders.map((order) => (
              <div key={order.id} className="w-full max-w-md">
                <OrderCard
                  title={order.name}
                  description={order.description}
                  objectName={order.object.address}
                  userNickname={order.user.email}
                  price={`${order.price} грн`}
                  orderType={order.type}
                  customActionSlot={
                    order.type === "ORGANIZATION" &&
                    order.orderStatus !== "FINISHED" ? (
                      <ConfirmButton orderId={order.id} />
                    ) : undefined
                  }
                  showDefaultButton={
                    !(
                      order.type === "ORGANIZATION" &&
                      order.orderStatus !== "FINISHED"
                    ) && false
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {finishedOrders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Виконані заявки</h2>
          <div className="flex gap-4 flex-wrap">
            {finishedOrders.map((order) => (
              <div key={order.id} className="w-full max-w-md">
                <OrderCard
                  title={order.name}
                  description={order.description}
                  objectName={order.object.address}
                  userNickname={order.user.email}
                  price={`${order.price} грн`}
                  orderType={order.type}
                  showDefaultButton={false}
                  customActionSlot={
                    order.type === "ORGANIZATION" &&
                    order.orderStatus === "FINISHED" ? (
                      <p className="text-green-600 font-semibold text-base text-center py-2">
                        Володіння підтверджено
                      </p>
                    ) : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {ordersData.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Заявок для цієї компанії ще немає.
        </p>
      )}
    </div>
  );
}

export default OrdersPage;
