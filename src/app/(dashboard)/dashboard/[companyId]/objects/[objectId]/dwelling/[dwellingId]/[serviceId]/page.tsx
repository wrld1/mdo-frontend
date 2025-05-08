import { AddPaymentForm } from "@/components/Forms/AddPaymentForm";
import { HistoryChart } from "./_components/HistoryChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDwellingServicesAction } from "@/actions/dwelling-service/get-dwelling-services";
import { getDwellingServiceByIdAction } from "@/actions/dwelling-service/get-dwelling-service";

interface DwellingServicePageProps {
  params: {
    companyId: string;
    objectId: string;
    dwellingId: string;
    serviceId: string;
  };
}

const generateExamplePayments = () => {
  const payments = [];
  const currentDate = new Date(2025, 4, 8); // May 8, 2025 (Month is 0-indexed, so 4 is May)
  let currentCounter = 1000; // This counter's behavior depends on the loop order and push sequence

  // Generate last 12 rolling months
  // payments are added newest first in this loop
  for (let i = 0; i < 12; i++) {
    const paymentDate = new Date(currentDate);
    paymentDate.setMonth(currentDate.getMonth() - i);
    paymentDate.setDate(1); // Start of the month

    const endDate = new Date(paymentDate);
    endDate.setMonth(paymentDate.getMonth() + 1);
    endDate.setDate(0); // End of the month (last day of the start month)

    currentCounter += Math.random() * 20 + 5; // Increment counter

    payments.push({
      id: i + 1, // IDs 1 through 12
      startDate: paymentDate.toISOString(),
      endDate: endDate.toISOString(),
      amount: Math.floor(Math.random() * 150) + 100,
      counter: parseFloat(currentCounter.toFixed(2)),
      status: i === 0 ? "PENDING" : "PAID",
      paymentDate:
        i === 0
          ? null
          : new Date(
              paymentDate.getFullYear(),
              paymentDate.getMonth(),
              15
            ).toISOString(),
      createdAt: new Date().toISOString(), // For example data, keeping it simple
      updatedAt: new Date().toISOString(),
      dwellingServiceId: 1,
    });
  }

  // Add specific payments for Oct, Nov, Dec of the year before currentDate's year
  const pastCalendarYear = currentDate.getFullYear() - 1; // e.g., 2024 if currentDate is in 2025
  const lastThreeMonthsIndices = [9, 10, 11]; // 0-indexed: October, November, December

  for (let j = 0; j < lastThreeMonthsIndices.length; j++) {
    const monthIndex = lastThreeMonthsIndices[j];
    // Create a date for the 1st of Oct/Nov/Dec of the past calendar year
    const paymentStartDate = new Date(pastCalendarYear, monthIndex, 1);

    const paymentEndDate = new Date(paymentStartDate);
    paymentEndDate.setMonth(paymentStartDate.getMonth() + 1);
    paymentEndDate.setDate(0); // End of the month

    currentCounter += Math.random() * 20 + 5; // Continue incrementing counter

    payments.push({
      id: 12 + j + 1, // IDs 13, 14, 15
      startDate: paymentStartDate.toISOString(),
      endDate: paymentEndDate.toISOString(),
      amount: Math.floor(Math.random() * 120) + 80, // Slightly different amount range for variety
      counter: parseFloat(currentCounter.toFixed(2)),
      status: "PAID", // These are older, so likely paid
      paymentDate: new Date(pastCalendarYear, monthIndex, 15).toISOString(), // Example payment date mid-month
      createdAt: new Date(pastCalendarYear, monthIndex, 16).toISOString(), // Example createdAt
      updatedAt: new Date(pastCalendarYear, monthIndex, 17).toISOString(), // Example updatedAt
      dwellingServiceId: 1,
    });
  }

  // The `payments` array currently has newest (from rolling 12) then Oct,Nov,Dec of past year.
  // Reversing it will make the oldest payments appear first in the final array.
  return payments.reverse();
};

const examplePayments = generateExamplePayments();

console.log("examplePayments", examplePayments);

export default async function DwellingServicePage({
  params,
}: DwellingServicePageProps) {
  const dwellingServiceId = parseInt(params.serviceId, 10);

  const dwellingService = await getDwellingServiceByIdAction(dwellingServiceId);

  console.log("dwellingService", dwellingService);

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
          <HistoryChart payments={examplePayments} />
        </div>
        <div className="w-1-2 flex-1">
          <AddPaymentForm dwellingServiceId={dwellingServiceId} />
        </div>
      </div>
    </div>
  );
}
