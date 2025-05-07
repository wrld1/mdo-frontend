import { AddPaymentForm } from "@/components/Forms/AddPaymentForm";
import { HistoryChart } from "./_components/HistoryChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DwellingServicePageProps {
  params: {
    companyId: string;
    objectId: string;
    dwellingId: string;
    serviceId: string;
  };
}

export default function DwellingServicePage({
  params,
}: DwellingServicePageProps) {
  const dwellingServiceId = parseInt(params.serviceId, 10);

  if (isNaN(dwellingServiceId)) {
    return <div>Невірний ID послуги.</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Інформація по послузі (ID: {params.serviceId})</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Тут буде детальна інформація про послугу та її історію.</p>
        </CardContent>
      </Card>

      <HistoryChart />

      <AddPaymentForm dwellingServiceId={dwellingServiceId} />
    </div>
  );
}
