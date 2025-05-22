import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { getOrdersAction } from "@/actions/order/get-orders-action";
import { Order, OrderStatus } from "@/types/interfaces/order";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ConfirmButton } from "./_components/ConfirmButton";
import OrderCard from "./_components/OrderCard";
import { isActionError } from "@/types/guards/isActionError";
import { updateOrderAction } from "@/actions/order/update-order-action";
import { toast } from "@/components/ui/use-toast";

interface PageProps {
  params: {
    companyId: string;
  };
}

async function OrdersPage({ params }: PageProps) {
  const { companyId } = params;

  const ordersRes = await getOrdersAction({
    companyId,
    limit: 20,
    offset: 0,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (isActionError(ordersRes)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Помилка: {ordersRes.error}</p>
      </div>
    );
  }

  const ordersData = ordersRes;

  const newOrders = ordersData.filter(
    (order) => order.orderStatus === OrderStatus.RECEIVED
  );
  const activeOrders = ordersData.filter(
    (order) => order.orderStatus === OrderStatus.IN_PROGRESS
  );
  const finishedOrders = ordersData.filter(
    (order) => order.orderStatus === OrderStatus.FINISHED
  );

  const handleTakeOrderAndUpdateStatus = async (
    orderId: string,
    orderTitle: string
  ) => {
    const result = await updateOrderAction(orderId, {
      orderStatus: OrderStatus.IN_PROGRESS,
    });

    if (isActionError(result)) {
      toast({
        variant: "destructive",
        title: "Помилка",
        description: result.error || "Не вдалося взяти заявку в роботу.",
      });
    } else {
      toast({
        title: "Заявку взято в роботу",
        description: `Заявка "${orderTitle}" тепер в процесі виконання.`,
      });
    }
  };

  const renderOrderCard = (order: Order) => {
    const isOrganizationOrder = order.type === "ORGANIZATION";
    const isFinished = order.orderStatus === OrderStatus.FINISHED;

    let customActionSlotForCard: React.ReactNode = undefined;

    if (isFinished) {
      if (isOrganizationOrder) {
        customActionSlotForCard = (
          <p className="text-green-600 font-semibold text-base text-center py-2">
            Володіння підтверджено
          </p>
        );
      } else {
        customActionSlotForCard = (
          <p className="text-gray-600 font-semibold text-base text-center py-2">
            Заявку виконано
          </p>
        );
      }
    } else if (isOrganizationOrder) {
      customActionSlotForCard = <ConfirmButton orderId={order.id} />;
    }

    return (
      <div key={order.id} className="w-full max-w-md">
        <OrderCard order={order} customActionSlot={customActionSlotForCard} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <Button asChild className="mr-auto">
        <Link href={`/dashboard/${companyId}/orders/create`}>
          Створити нову заявку
        </Link>
      </Button>

      {newOrders.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Нові заявки</h2>
          <div className="flex gap-4 flex-wrap">
            {newOrders.map(renderOrderCard)}
          </div>
        </div>
      )}

      {activeOrders.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Заявки в роботі</h2>
          <div className="flex gap-4 flex-wrap">
            {activeOrders.map(renderOrderCard)}
          </div>
        </div>
      )}

      {finishedOrders.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Виконані заявки</h2>
          <div className="flex gap-4 flex-wrap">
            {finishedOrders.map(renderOrderCard)}
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
