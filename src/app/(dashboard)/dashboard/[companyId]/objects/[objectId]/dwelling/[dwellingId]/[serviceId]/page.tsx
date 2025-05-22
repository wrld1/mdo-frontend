import { AddPaymentForm } from "@/components/Forms/AddPaymentForm";
import { HistoryChart } from "./_components/HistoryChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDwellingServiceByIdAction } from "@/actions/dwelling-service/get-dwelling-service";

interface DwellingServicePageProps {
  params: {
    companyId: string;
    objectId: string;
    dwellingId: string;
    serviceId: string;
  };
}

export default async function DwellingServicePage({
  params,
}: DwellingServicePageProps) {
  const dwellingServiceId = parseInt(params.serviceId, 10);

  const dwellingService = await getDwellingServiceByIdAction(dwellingServiceId);

  console.log("payments", dwellingService.payments);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Інформація по послузі (ID: {params.serviceId})</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Тут буде детальна інформація про послугу та її історію.</p>
        </CardContent>
      </Card>
      <div className="w-full flex gap-4 ">
        <div className="w-1-2 flex-1">
          <HistoryChart payments={dwellingService.payments} />
        </div>
        <div className="w-1-2 flex-1">
          <AddPaymentForm dwellingServiceId={dwellingServiceId} />
        </div>
      </div>
    </div>
  );
}
