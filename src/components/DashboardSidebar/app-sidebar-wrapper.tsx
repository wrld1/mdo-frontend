import { getOrdersAction } from "@/actions/order/get-orders-action";
import { AppSidebar } from "./app-sidebar";
import { UserResponse } from "@/types/interfaces/user";
import { CompanyWithAccess } from "@/types/interfaces/company";
import { OrderStatus } from "@/types/interfaces/order";

interface AppSidebarServerProps {
  user: UserResponse | null;
  companiesWithAccess: CompanyWithAccess[];
  companyId: string;
}

export default async function AppSidebarWrapper({
  user,
  companiesWithAccess,
  companyId,
}: AppSidebarServerProps) {
  const orders = await getOrdersAction({ companyId });

  const ordersCount = Array.isArray(orders)
    ? orders.filter(
        (order) =>
          order.orderStatus === OrderStatus.RECEIVED ||
          order.orderStatus === OrderStatus.IN_PROGRESS
      ).length
    : 0;

  return (
    <AppSidebar
      user={user}
      companiesWithAccess={companiesWithAccess}
      ordersCount={ordersCount}
    />
  );
}
