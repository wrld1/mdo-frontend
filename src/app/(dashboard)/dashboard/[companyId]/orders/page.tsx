import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { getOrdersAction } from "@/actions/get-orders-action";
import { Order } from "@/types/interfaces/order";

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
    <div className="flex justify-between">
      {orders?.map((order) => (
        <Card key={order.id} className="w-[350px]">
          <CardHeader>
            <CardTitle>{order.name}</CardTitle>
            <CardDescription>{order.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* {order.userId} */}
            {/* Price: ${service.price} */}
          </CardContent>
          {/* <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter> */}
        </Card>
      ))}
    </div>
  );
}

export default OrdersPage;
