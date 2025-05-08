"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ServicePayment } from "@/types/interfaces/service-payment";

interface HistoryChartProps {
  payments: ServicePayment[];
  currentYear?: number;
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const processPaymentDataForChart = (
  payments: ServicePayment[],
  targetYear: number
) => {
  const lastYear = targetYear - 1;
  const monthlyData = Array(12)
    .fill(null)
    .map((_, i) => ({
      month: monthNames[i],
      currentYearAmount: 0,
      currentYearCounter: 0,
      lastYearAmount: 0,
      lastYearCounter: 0,
    }));

  payments.forEach((payment) => {
    const paymentDate = new Date(payment.startDate);
    const year = paymentDate.getFullYear();
    const monthIndex = paymentDate.getMonth(); // 0-11

    if (year === targetYear) {
      monthlyData[monthIndex].currentYearAmount += payment.amount;
      monthlyData[monthIndex].currentYearCounter += payment.counter;
    } else if (year === lastYear) {
      monthlyData[monthIndex].lastYearAmount += payment.amount;
      monthlyData[monthIndex].lastYearCounter += payment.counter;
    }
  });
  return monthlyData;
};

const chartConfig = {
  currentYearAmount: {
    label: "Поточний рік (Сума)",
    color: "hsl(var(--chart-1))",
  },
  lastYearAmount: {
    label: "Минулий рік (Сума)",
    color: "hsl(var(--chart-2))",
  },
  currentYearCounter: {
    label: "Поточний рік (Лічильник)",
  },
  lastYearCounter: {
    label: "Минулий рік (Лічильник)",
  },
} satisfies ChartConfig;

export function HistoryChart({
  payments,
  currentYear = new Date().getFullYear(),
}: HistoryChartProps) {
  const chartData = processPaymentDataForChart(payments, currentYear);

  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 text-xs bg-background border rounded-md shadow-lg">
          <p className="font-bold text-sm mb-1">{label}</p>
          {payload.map((entry: any) => (
            <div
              key={entry.dataKey}
              style={{ color: entry.color }}
              className="flex justify-between items-center"
            >
              <span>
                {chartConfig[entry.dataKey as keyof typeof chartConfig]
                  ?.label || entry.name}
                :
              </span>
              <span className="font-semibold ml-2">{entry.value} грн</span>
            </div>
          ))}
          {data.currentYearCounter > 0 && (
            <p
              style={{ color: chartConfig.currentYearAmount.color }}
              className="text-xs mt-1"
            >
              Лічильник (Поточний): {data.currentYearCounter.toFixed(2)}
            </p>
          )}
          {data.lastYearCounter > 0 && (
            <p
              style={{ color: chartConfig.lastYearAmount.color }}
              className="text-xs mt-1"
            >
              Лічильник (Минулий): {data.lastYearCounter.toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Історія платежів</CardTitle>
        <CardDescription>
          Порівняння сум за {currentYear} та {currentYear - 1} роки
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => `${value} грн`}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <ChartTooltip cursor={true} content={<CustomTooltipContent />} />
            <Bar
              dataKey="lastYearAmount"
              fill="var(--color-lastYearAmount)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="currentYearAmount"
              fill="var(--color-currentYearAmount)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Відображення загальних сум платежів за місяць.
        </div>
      </CardFooter>
    </Card>
  );
}
