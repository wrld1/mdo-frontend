"use client";

import { useState, useTransition, ChangeEvent } from "react";
import *_ from "lodash"; // For potential utility if needed, or remove if not used
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { PaymentStatus } from "@/types/enums/paymentStatus";

// Import the updated action
import { uploadPayments } from "@/actions/service-payments/process-uploaded-payments.action";
// Import necessary types for payload and response
import {
  AddPaymentRequest,
  CreateServicePaymentDto,
  AddPaymentsResponse,
  PaymentProcessingResult,
} from "@/types/interfaces/service-payment";

interface ExcelPaymentRow {
  dwellingId: number;
  serviceId: number;
  month: number; // 1-12
  year: number;
  amount?: number;
  counter: number;
  status?: PaymentStatus;
  objectId?: string; // For display/validation, not directly part of DTO
}

export default function DataImportPage() {
  const [isParsing, startParsingTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentsData, setPaymentsData] = useState<ExcelPaymentRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: "Помилка",
        description: `Файл не вибрано.`,
        variant: "destructive",
      });
      return;
    }
    setFileName(file.name);
    setPaymentsData([]); // Clear previous data

    startParsingTransition(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            toast({
              title: "Помилка",
              description: `Не вдалося прочитати файл.`,
              variant: "destructive",
            });
            return;
          }
          const workbook = XLSX.read(data, {
            type: "binary",
            cellDates: false,
            raw: false,
          });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

          if (jsonData.length === 0) {
            toast({
              title: "Інформація",
              description:
                "Файл порожній або не містить даних у відомому форматі.",
            });
            setFileName(null);
            return;
          }

          const parsedData: ExcelPaymentRow[] = jsonData.map(
            (row: any, index: number) => {
              const requiredFields = [
                "dwellingId",
                "serviceId",
                "month",
                "year",
                "counter",
              ];
              for (const field of requiredFields) {
                if (
                  row[field] === undefined ||
                  row[field] === null ||
                  row[field] === ""
                ) {
                  throw new Error(
                    `Рядок ${
                      index + 2
                    }: Відсутнє або порожнє обов'язкове поле: ${field}.`
                  );
                }
              }

              const month = Number(row.month);
              const year = Number(row.year);
              const counter = Number(row.counter);

              if (isNaN(month) || month < 1 || month > 12) {
                throw new Error(
                  `Рядок ${index + 2}: Некоректне значення місяця (1-12): ${
                    row.month
                  }.`
                );
              }
              if (isNaN(year) || year < 2000 || year > 2100) {
                throw new Error(
                  `Рядок ${index + 2}: Некоректне значення року (2000-2100): ${
                    row.year
                  }.`
                );
              }
               if (isNaN(Number(row.dwellingId))) {
                throw new Error(`Рядок ${index + 2}: Некоректне значення dwellingId: ${row.dwellingId}.`);
              }
              if (isNaN(Number(row.serviceId))) {
                throw new Error(`Рядок ${index + 2}: Некоректне значення serviceId: ${row.serviceId}.`);
              }
              if (isNaN(counter)) {
                throw new Error(
                  `Рядок ${index + 2}: Некоректне значення лічильника: ${
                    row.counter
                  }.`
                );
              }
              const amountValue = row.amount !== undefined && row.amount !== null && row.amount !== "" ? Number(row.amount) : undefined;
              if (row.amount !== undefined && row.amount !== null && row.amount !== "" && isNaN(amountValue!)) {
                 throw new Error(`Рядок ${index + 2}: Некоректне значення суми: ${row.amount}.`);
              }

              return {
                dwellingId: Number(row.dwellingId),
                serviceId: Number(row.serviceId),
                month: month,
                year: year,
                amount: amountValue,
                counter: counter,
                status: (row.status as PaymentStatus) || PaymentStatus.PENDING,
                objectId: row.objectId ? String(row.objectId) : undefined,
              };
            }
          );

          setPaymentsData(parsedData);
          toast({
            title: "Успішно",
            description: `Файл "${file.name}" успішно завантажено та розпарсено. ${parsedData.length} записів знайдено.`,
          });
        } catch (error) {
          console.error("Error parsing Excel file:", error);
          toast({
            title: "Помилка розбору файлу",
            description: `${
              error instanceof Error ? error.message : "Невідома помилка"
            }`,
            variant: "destructive",
          });
          setPaymentsData([]);
          setFileName(null);
        }
      };
      reader.onerror = () => {
        toast({
          title: "Помилка",
          description: "Помилка читання файлу.",
          variant: "destructive",
        });
        setPaymentsData([]);
        setFileName(null);
      };
      reader.readAsBinaryString(file);
    });
  };

  const handleProcessPayments = async () => {
    if (paymentsData.length === 0) {
      toast({
        title: "Інформація",
        description: `Немає даних для обробки. Будь ласка, завантажте файл.`,
      });
      return;
    }
    setIsProcessing(true);
    toast({
      title: "Обробка",
      description: `Надсилання ${paymentsData.length} записів...`,
    });

    // Map ExcelPaymentRow[] to AddPaymentRequest[]
    const paymentRequests: AddPaymentRequest[] = paymentsData.map((item) => ({
      dwellingId: item.dwellingId,
      serviceId: item.serviceId,
      // dwellingServiceId is omitted; backend will resolve by dwellingId and serviceId
      payment: {
        month: item.month,
        year: item.year,
        amount: item.amount, 
        counter: item.counter,
        status: item.status || PaymentStatus.PENDING,
      } as CreateServicePaymentDto,
    }));

    const result = await uploadPayments(paymentRequests);
    setIsProcessing(false);

    if ("error" in result) {
      toast({
        title: "Загальна помилка обробки",
        description: result.error,
        variant: "destructive",
        duration: 7000,
      });
    } else {
      const backendResponse = result as AddPaymentsResponse;
      toast({
        title: "Результат обробки",
        description: `${backendResponse.message}. Успішно: ${backendResponse.processedCount}/${backendResponse.totalRequests}.`,
        duration: 7000,
      });

      const individualErrors = backendResponse.results.filter(r => r.error);
      if (individualErrors.length > 0) {
        toast({
          title: `Завершено з помилками по окремим записам (${individualErrors.length})`,
          description: `Не вдалося обробити ${individualErrors.length} з ${backendResponse.totalRequests} платежів. Дивіться консоль для деталей.`,
          variant: "destructive",
          duration: 10000,
        });
        console.error("Деталі помилок обробки окремих платежів:", individualErrors);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Імпорт даних для нарахувань</h1>
      <Tabs defaultValue="data-import" className="w-full">
        <TabsList>
          <TabsTrigger value="data-import">Імпорт платежів</TabsTrigger>
        </TabsList>
        <TabsContent value="data-import" className="mt-4">
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-medium">Завантаження Excel файлу</h2>
            <p className="text-sm text-muted-foreground">
              Завантажте Excel файл (.xlsx, .xls, .csv) з даними для створення
              платежів. Обов&apos;язкові колонки:{" "}
              <strong>dwellingId, serviceId, month, year, counter</strong>.
              Опціональні: <strong>amount, status, objectId</strong> (objectId
              для відображення, не надсилається). Місяць (month) має бути числом
              від 1 до 12. Рік (year) - числом (напр., 2024). Статус за
              замовчуванням PENDING.
            </p>
            <Input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              disabled={isParsing || isProcessing}
              className="max-w-md"
              key={fileName || Date.now()} // To reset file input
            />
            {fileName && <p className="text-sm">Обраний файл: {fileName}</p>}

            {isParsing && (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Розбір файлу...</span>
              </div>
            )}

            {paymentsData.length > 0 && !isParsing && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">
                  Перегляд завантажених даних ({paymentsData.length} записів)
                </h3>
                <div className="max-h-96 overflow-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Object ID</TableHead>
                        <TableHead>Dwelling ID</TableHead>
                        <TableHead>Service ID</TableHead>
                        <TableHead>Month</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Counter</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentsData.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell>{payment.objectId ?? "-"}</TableCell>
                          <TableCell>{payment.dwellingId}</TableCell>
                          <TableCell>{payment.serviceId}</TableCell>
                          <TableCell>{payment.month}</TableCell>
                          <TableCell>{payment.year}</TableCell>
                          <TableCell>{payment.amount ?? "-"}</TableCell>
                          <TableCell>{payment.counter}</TableCell>
                          <TableCell>{payment.status ?? "PENDING"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button
                  onClick={handleProcessPayments}
                  disabled={isProcessing || isParsing || paymentsData.length === 0}
                  className="mt-4"
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Обробити платежі ({paymentsData.length})
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  Натискаючи &ldquo;Обробити платежі&rdquo;, ви ініціюєте
                  створення платіжних записів в системі для кожного рядка з
                  таблиці вище. Переконайтеся, що дані коректні.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}