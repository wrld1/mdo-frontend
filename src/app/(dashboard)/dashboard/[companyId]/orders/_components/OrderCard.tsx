"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus } from "@/types/interfaces/order";
import { Loader2 } from "lucide-react";
import { updateOrderAction } from "@/actions/order/update-order-action";
import { isActionError } from "@/types/guards/isActionError";
import { toast } from "@/components/ui/use-toast";

interface OrderCardProps {
  order: Order;
  customActionSlot?: React.ReactNode;
}

export default function OrderCard({ order, customActionSlot }: OrderCardProps) {
  const [isLoadingTakeOrder, setIsLoadingTakeOrder] = useState(false);
  const [isLoadingCompleteOrder, setIsLoadingCompleteOrder] = useState(false);

  const {
    id: orderId,
    name: orderTitle,
    description,
    object,
    user,
    price,
    type: orderType,
    orderStatus,
  } = order;

  const handleTakeOrderClick = async () => {
    if (!orderId) return;

    setIsLoadingTakeOrder(true);
    try {
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
    } catch (error) {
      console.error("Error taking order:", error);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Сталася непередбачена помилка.",
      });
    } finally {
      setIsLoadingTakeOrder(false);
    }
  };

  const handleCompleteOrderClick = async () => {
    if (!orderId) return;

    setIsLoadingCompleteOrder(true);
    try {
      const result = await updateOrderAction(orderId, {
        orderStatus: OrderStatus.FINISHED,
      });

      if (isActionError(result)) {
        toast({
          variant: "destructive",
          title: "Помилка",
          description: result.error || "Не вдалося завершити заявку.",
        });
      } else {
        toast({
          title: "Заявку виконано",
          description: `Заявка "${orderTitle}" успішно завершена.`,
        });
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Сталася непередбачена помилка при завершенні заявки.",
      });
    } finally {
      setIsLoadingCompleteOrder(false);
    }
  };

  const canDisplayTakeOrderButton =
    !customActionSlot && orderStatus === OrderStatus.RECEIVED;
  const canDisplayCompleteOrderButton =
    !customActionSlot && orderStatus === OrderStatus.IN_PROGRESS;

  return (
    <Card className="w-full max-w-md overflow-hidden border-0 shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-medium">{orderTitle}</CardTitle>
            <CardDescription className="mt-1 text-base">
              {description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-slate-50">
            {orderType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 flex-1">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Об&lsquo;єкт:</span>
            <span className="font-medium">{object.address}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Заявка від:</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ціна:</span>
            <span className="font-medium">{price || 0} грн</span>
          </div>
          {orderStatus && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Статус:</span>
              <Badge
                variant={
                  orderStatus === OrderStatus.FINISHED
                    ? "default"
                    : orderStatus === OrderStatus.IN_PROGRESS
                    ? "secondary"
                    : orderStatus === OrderStatus.RECEIVED
                    ? "outline"
                    : "destructive"
                }
              >
                {orderStatus}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
      {(customActionSlot ||
        canDisplayTakeOrderButton ||
        canDisplayCompleteOrderButton) && (
        <CardFooter className="py-3 border-t bg-slate-50">
          {customActionSlot ? (
            <div className="w-full">{customActionSlot}</div>
          ) : canDisplayTakeOrderButton ? (
            <Button
              className="w-full mt-0 mx-auto"
              onClick={handleTakeOrderClick}
              disabled={isLoadingTakeOrder}
            >
              {isLoadingTakeOrder && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Взяти Заявку
            </Button>
          ) : canDisplayCompleteOrderButton ? (
            <Button
              className="w-full mt-0 mx-auto"
              onClick={handleCompleteOrderClick}
              disabled={isLoadingCompleteOrder}
            >
              {isLoadingCompleteOrder && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Заявка виконана
            </Button>
          ) : null}
        </CardFooter>
      )}
    </Card>
  );
}
