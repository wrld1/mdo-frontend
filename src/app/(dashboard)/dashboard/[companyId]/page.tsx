import { getCompany } from "@/actions/company/get-company-action";
import { isActionError } from "@/types/guards/isActionError";
import { getOrdersAction } from "@/actions/order/get-orders-action";
import { Order, OrderStatus } from "@/types/interfaces/order";
import {
  Users,
  ListOrdered,
  Building2,
  Home,
  Clock,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import OrderCard from "./orders/_components/OrderCard";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: {
    companyId: string;
  };
}

function DateTimeInfo() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return { time: formattedTime, date: formattedDate };
}

export default async function CompanyPage({ params }: PageProps) {
  const { companyId } = params;
  const company = await getCompany(companyId);

  console.log("Company data:", company);

  if (isActionError(company)) {
    console.error("Failed to load company data:", company.error);
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Ласкаво просимо</h1>
        <p className="text-destructive text-xl">
          Не вдалося завантажити інформацію про компанію.
        </p>
      </div>
    );
  }

  const stats = {
    customersCount: company.users?.length || 0,
    objectsCount: company.objects?.length || 0,
    dwellingsCount:
      company.objects?.reduce(
        (acc, obj) => acc + (obj.dwellings?.length || 0),
        0
      ) || 0,
  };

  const ordersResult = await getOrdersAction({
    companyId,
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const recentOrders = !isActionError(ordersResult) ? ordersResult : [];
  const ordersInProgressCount = recentOrders.filter(
    (o: Order) =>
      o.orderStatus !== OrderStatus.FINISHED &&
      o.orderStatus !== OrderStatus.BLOCKED
  ).length;
  const ordersCompletedCount = recentOrders.filter(
    (o: Order) => o.orderStatus === OrderStatus.FINISHED
  ).length;
  const latestOrder = recentOrders.length > 0 ? recentOrders[0] : null;

  const companyDisplayName = company.name || `ID: ${company.id}`;
  const { time: currentTime, date: currentDate } = DateTimeInfo();

  const features = [
    {
      Icon: Users,
      name: "Статистика Компанії",
      description: `Клієнти: ${stats.customersCount} · Об'єкти: ${stats.objectsCount} · Помешкання: ${stats.dwellingsCount}`,
      href: `/dashboard/${companyId}/analytics`,
      cta: "Детальніше",
      className: "lg:col-span-1",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 opacity-50"></div>
      ),
    },
    {
      Icon: Clock,
      name: `${currentTime}`,
      description: `${currentDate}`,
      className: "lg:col-span-1",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/30 dark:via-amber-900/30 dark:to-orange-900/30 opacity-50 flex items-center justify-center">
          <Clock className="w-24 h-24 text-foreground/10" />
        </div>
      ),
    },
    {
      Icon: ListOrdered,
      name: "Огляд Заявок",
      description: `В роботі: ${ordersInProgressCount}, Виконані: ${ordersCompletedCount}. ${
        latestOrder
          ? `Остання: ${latestOrder.name.substring(0, 25)}...`
          : "Нових заявок немає."
      }`,
      href: `/dashboard/${companyId}/orders`,
      cta: "Всі заявки",
      className: "lg:col-span-1",
      background: (
        <div className="absolute inset-0 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 dark:from-green-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 opacity-60">
          {latestOrder ? (
            <OrderCard
              order={latestOrder}
              customActionSlot={
                <div className="text-center w-full">
                  <Badge
                    variant={
                      latestOrder.orderStatus === OrderStatus.FINISHED
                        ? "default"
                        : latestOrder.orderStatus === OrderStatus.IN_PROGRESS
                        ? "secondary"
                        : latestOrder.orderStatus === OrderStatus.RECEIVED
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {latestOrder.orderStatus}
                  </Badge>
                </div>
              }
            />
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              <ListOrdered className="w-10 h-10 sm:w-12 sm:h-12 mx-auto opacity-50" />
              <p className="mt-2 text-xs sm:text-sm">Нових заявок немає</p>
            </div>
          )}
        </div>
      ),
    },

    {
      Icon: LinkIcon,
      name: "Швидкі Посилання",
      description: "Миттєвий доступ до важливих розділів.",
      href: `/dashboard/${companyId}/settings`, // General link, or remove if buttons handle all
      cta: "Налаштування",
      className: "lg:col-span-2", // Span more if it contains multiple links
      background: (
        <div className="absolute inset-0 p-6 flex flex-col space-y-2 justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 dark:from-slate-900/30 dark:via-gray-900/30 dark:to-stone-900/30 opacity-50">
          <Button
            variant="ghost"
            asChild
            className="justify-start text-foreground/80 hover:text-primary"
          >
            <Link href={`/dashboard/${companyId}/objects`}>
              <Building2 className="w-4 h-4 mr-2" /> Об&apos;єкти
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="justify-start text-foreground/80 hover:text-primary"
          >
            <Link href={`/dashboard/${companyId}/services-tariffs`}>
              <Home className="w-4 h-4 mr-2" /> Послуги та Тарифи
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-3xl font-bold">Ласкаво просимо</h1>
        <h2 className="text-xl font-semibold text-muted-foreground">
          {companyDisplayName}
        </h2>
      </div>

      <BentoGrid className="lg:grid-cols-3 auto-rows-[18rem] md:auto-rows-[20rem]">
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}
