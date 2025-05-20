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

interface PageProps {
  params: {
    companyId: string;
  };
}

async function OrdersPage({ params }: PageProps) {
  const { companyId } = params;

  const ordersData: Order[] = await getOrdersAction({
    companyId,
    limit: 10,
    offset: 0,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

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
              <Card key={order.id} className="w-[350px]">
                <CardHeader>
                  <CardTitle className="text-xl">{order.name}</CardTitle>
                  <CardDescription className="text-lg">
                    Опис: {order.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <span className="inline-block p-2 bg-slate-200 rounded-md">
                    Об&apos;єкт: {order.object.address}
                  </span>
                  <p>
                    Заявка від{" "}
                    <span className="font-semibold"> {order.user.email}</span>
                  </p>
                  <p> Вартість: {order.price} грн</p>
                  <p> Тип: {order.type}</p>
                  {order.type === "ORGANIZATION" &&
                    order.orderStatus !== "FINISHED" && (
                      <ConfirmButton orderId={order.id} />
                    )}
                  {/* This condition might be redundant here as these are active orders */}
                </CardContent>
                {/* <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Deploy</Button>
              </CardFooter> */}
              </Card>
            ))}
          </div>
        </div>
      )}

      {finishedOrders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Виконані заявки</h2>
          <div className="flex gap-4 flex-wrap">
            {finishedOrders.map((order) => (
              <Card key={order.id} className="w-[350px]">
                <CardHeader>
                  <CardTitle className="text-xl">{order.name}</CardTitle>
                  <CardDescription className="text-lg">
                    Опис: {order.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <span className="inline-block p-2 bg-slate-200 rounded-md">
                    Об&apos;єкт: {order.object.address}
                  </span>
                  <p>
                    Заявка від{" "}
                    <span className="font-semibold"> {order.user.email}</span>
                  </p>
                  <p> Вартість: {order.price} грн</p>
                  <p> Тип: {order.type}</p>
                  {order.type === "ORGANIZATION" &&
                    order.orderStatus === "FINISHED" && ( // This condition is specific to finished orders
                      <p className="text-green-600 font-semibold mt-2">
                        Володіння підтверджено
                      </p>
                    )}
                </CardContent>
                {/* <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Deploy</Button>
              </CardFooter> */}
              </Card>
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
