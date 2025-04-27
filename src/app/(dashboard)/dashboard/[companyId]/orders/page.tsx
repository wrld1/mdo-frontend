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

  const orders: Order[] = await getOrdersAction({
    companyId,
    limit: 10,
    offset: 0,
    sortBy: "id",
    sortOrder: "asc",
  });

  console.log("orders", orders);

  return (
    <div className="flex flex-col gap-8">
      <Button asChild className="mr-auto">
        <Link href={`/dashboard/${companyId}/orders/create`}>
          Створити нову заявку
        </Link>
      </Button>
      <div className="flex gap-4 flex-wrap">
        {orders?.map((order) => (
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
              {order.type === "ORGANIZATION" &&
                order.orderStatus === "FINISHED" && (
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
  );
}

export default OrdersPage;
