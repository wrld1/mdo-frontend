"use client";

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
} from "@/components/ui/chart";
import { ServicePayment } from "@/types/interfaces/service-payment";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HistoryChartProps {
  payments: ServicePayment[];
  currentYearProp?: number;
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
  displayYear: number,
  comparisonYear?: number
) => {
  const monthlyData = Array(12)
    .fill(null)
    .map((_, i) => ({
      month: monthNames[i],
      currentYearAmount: 0,
      currentYearCounter: 0,
      comparisonYearAmount: 0,
      comparisonYearCounter: 0,
    }));

  payments.forEach((payment) => {
    const year = payment.year;
    const monthIndex = payment.month - 1;

    if (monthIndex >= 0 && monthIndex < 12) {
      if (year === displayYear) {
        monthlyData[monthIndex].currentYearAmount += payment.amount;
        monthlyData[monthIndex].currentYearCounter += payment.counter;
      } else if (comparisonYear !== undefined && year === comparisonYear) {
        monthlyData[monthIndex].comparisonYearAmount += payment.amount;
        monthlyData[monthIndex].comparisonYearCounter += payment.counter;
      }
    }
  });
  return monthlyData;
};

const chartConfig = {
  currentYearAmount: {
    label: "Поточний рік (Сума)",
    color: "hsl(var(--chart-1))",
  },
  comparisonYearAmount: {
    label: "Рік порівняння (Сума)",
    color: "hsl(var(--chart-2))",
  },
  currentYearCounter: {
    label: "Поточний рік (Лічильник)",
  },
  comparisonYearCounter: {
    label: "Рік порівняння (Лічильник)",
  },
} satisfies ChartConfig;

export function HistoryChart({ payments, currentYearProp }: HistoryChartProps) {
  const currentYear = currentYearProp || new Date().getFullYear();
  // const chartData = processPaymentDataForChart(payments, currentYearProp);
  const [selectedComparisonYear, setSelectedComparisonYear] = useState<
    number | undefined
  >(undefined);

  const availableYearsForComparison = useMemo(() => {
    const years = new Set<number>();
    payments.forEach((p) => years.add(p.year));
    return Array.from(years)
      .filter((year) => year !== currentYear)
      .sort((a, b) => b - a);
  }, [payments, currentYear]);

  useEffect(() => {
    if (availableYearsForComparison.length > 0) {
      const previousYear = currentYear - 1;
      if (availableYearsForComparison.includes(previousYear)) {
        setSelectedComparisonYear(previousYear);
      } else {
        setSelectedComparisonYear(availableYearsForComparison[0]);
      }
    } else {
      setSelectedComparisonYear(undefined);
    }
  }, [availableYearsForComparison, currentYear]);

  const chartData = useMemo(() => {
    return processPaymentDataForChart(
      payments,
      currentYear,
      selectedComparisonYear
    );
  }, [payments, currentYear, selectedComparisonYear]);

  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 text-xs bg-background border rounded-md shadow-lg">
          <p className="font-bold text-sm mb-1">{label}</p>
          {payload.map((entry: any) => {
            let entryLabel =
              chartConfig[entry.dataKey as keyof typeof chartConfig]?.label ||
              entry.name;
            if (entry.dataKey === "currentYearAmount") {
              entryLabel = `${currentYear} (Сума)`;
            } else if (
              entry.dataKey === "comparisonYearAmount" &&
              selectedComparisonYear
            ) {
              entryLabel = `${selectedComparisonYear} (Сума)`;
            }

            return (
              <div
                key={entry.dataKey}
                style={{ color: entry.color }}
                className="flex justify-between items-center"
              >
                <span>{entryLabel}:</span>
                <span className="font-semibold ml-2">{entry.value} грн</span>
              </div>
            );
          })}
          {data.currentYearCounter > 0 && (
            <p
              style={{ color: chartConfig.currentYearAmount.color }}
              className="text-xs mt-1"
            >
              Лічильник ({currentYear}): {data.currentYearCounter.toFixed(2)}
            </p>
          )}
          {selectedComparisonYear && data.comparisonYearCounter > 0 && (
            <p
              style={{ color: chartConfig.comparisonYearAmount.color }}
              className="text-xs mt-1"
            >
              Лічильник ({selectedComparisonYear}):{" "}
              {data.comparisonYearCounter.toFixed(2)}
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
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="mb-2">Історія платежів</CardTitle>
            <CardDescription>
              Порівняння сум за {currentYear} рік
              {selectedComparisonYear
                ? ` та ${selectedComparisonYear} рік`
                : ""}
            </CardDescription>
          </div>
          {availableYearsForComparison.length > 0 && (
            <Select
              value={selectedComparisonYear?.toString()}
              onValueChange={(value) =>
                setSelectedComparisonYear(parseInt(value, 10))
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Обрати рік порівняння" />
              </SelectTrigger>
              <SelectContent>
                {availableYearsForComparison.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
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
            {selectedComparisonYear && (
              <Bar
                dataKey="comparisonYearAmount"
                fill="var(--color-comparisonYearAmount)"
                radius={[4, 4, 0, 0]}
              />
            )}
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
