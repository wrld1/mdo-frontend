"use client";

import { useState, useTransition, ChangeEvent } from "react";
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

import {
  processUploadedPaymentsAction,
  UploadPaymentPayload,
} from "@/actions/service-payments/process-uploaded-payments.action";

// Updated Excel row structure
interface ExcelPaymentRow {
  dwellingId: number; // Changed from dwellingServiceId
  serviceId: number; // Added
  startDate: string;
  endDate: string;
  amount?: number;
  counter: number;
  status?: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  objectId?: string; // For display/validation, not directly part of DTO
}

// This DTO for paymentDetails remains the same
export interface CreateServicePaymentDetailsDto {
  startDate: string;
  endDate: string;
  amount?: number;
  counter: number;
  status?: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
}

export default function DataExportPage() {
  const [isPending, startTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentsData, setPaymentsData] = useState<ExcelPaymentRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: "Error",
        description: `Файл не вибрано.`,
        variant: "destructive",
      });
      return;
    }
    setFileName(file.name);

    startTransition(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            toast({
              title: "Error",
              description: `Не вдалося прочитати файл.`,
              variant: "destructive",
            });
            return;
          }
          const workbook = XLSX.read(data, { type: "binary", cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

          const parsedData: ExcelPaymentRow[] = jsonData.map((row: any) => {
            if (
              !row.dwellingId ||
              !row.serviceId ||
              !row.counter ||
              !row.startDate ||
              !row.endDate
            ) {
              // Added checks for new fields
              throw new Error(
                "Відсутні обов'язкові поля: dwellingId, serviceId, startDate, endDate, або counter."
              );
            }
            return {
              dwellingId: Number(row.dwellingId), // New field
              serviceId: Number(row.serviceId), // New field
              startDate:
                row.startDate instanceof Date
                  ? row.startDate.toISOString()
                  : String(row.startDate),
              endDate:
                row.endDate instanceof Date
                  ? row.endDate.toISOString()
                  : String(row.endDate),
              amount: row.amount ? Number(row.amount) : undefined,
              counter: Number(row.counter),
              status: row.status as ExcelPaymentRow["status"],
              objectId: row.objectId ? String(row.objectId) : undefined,
            };
          });

          setPaymentsData(parsedData);
          toast({
            title: "Успішно",
            description: `Файл "${file.name}" успішно завантажено та розпарсено.`,
          });
        } catch (error) {
          console.error("Error parsing Excel file:", error);
          toast({
            title: "Error",
            description: `Помилка розбору файлу: ${
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
          title: "Error",
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
        title: "Інформація", // Changed title
        description: `Немає даних для обробки. Будь ласка, завантажте файл.`,
      });
      return;
    }
    setIsProcessing(true);
    toast({
      title: "Обробка", // Changed title
      description: `Розпочато обробку ${paymentsData.length} записів...`,
    });

    // Prepare data for the action, now an array of UploadPaymentPayload
    const payloadsToProcess: UploadPaymentPayload[] = paymentsData.map(
      (item) => ({
        dwellingId: item.dwellingId,
        serviceId: item.serviceId,
        paymentDetails: {
          // This is the nested payment DTO
          startDate: item.startDate,
          endDate: item.endDate,
          amount: item.amount,
          counter: item.counter,
          status: item.status,
        },
      })
    );

    const result = await processUploadedPaymentsAction(payloadsToProcess);

    if (result.success) {
      toast({
        title: "Успішно",
        description: `Успішно оброблено ${result.processedCount} з ${paymentsData.length} записів.`,
      });
      if (result.errors && result.errors.length > 0) {
        toast({
          title: "Помилки", // Changed title
          description: `${result.errors.length} записів не вдалося обробити. Дивіться консоль для деталей.`,
          variant: "destructive",
        });
        console.error("Помилки обробки:", result.errors);
      }
    } else {
      toast({
        title: "Помилка",
        description: `Помилка обробки: ${
          result.overallError || "Невідома помилка"
        }`,
        variant: "destructive",
      });
      if (result.errors && result.errors.length > 0) {
        console.error("Деталі помилок:", result.errors);
      }
    }
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Імпорт даних для нарахувань</h1>
      <Tabs defaultValue="data-export" className="w-full">
        <TabsList>
          <TabsTrigger value="data-export">Дата Експорт</TabsTrigger>
        </TabsList>
        <TabsContent value="data-export" className="mt-4">
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-medium">Завантаження Excel файлу</h2>
            <p className="text-sm text-muted-foreground">
              Завантажте Excel файл (.xlsx, .xls, .csv) з даними для створення
              платежів. Обов&apos;язкові колонки:{" "}
              <strong>
                dwellingId, serviceId, startDate, endDate, counter
              </strong>
              . Опціональні: <strong>amount, status, objectId</strong>. Дати
              (startDate, endDate) мають бути у форматі, який Excel розпізнає як
              дату, або як ISO рядки (YYYY-MM-DDTHH:mm:ss.sssZ).
            </p>
            <Input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              disabled={isPending || isProcessing}
              className="max-w-md"
            />
            {fileName && <p className="text-sm">Обраний файл: {fileName}</p>}

            {isPending && (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Обробка файлу...</span>
              </div>
            )}

            {paymentsData.length > 0 && !isPending && (
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
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
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
                          <TableCell>{payment.startDate}</TableCell>
                          <TableCell>{payment.endDate}</TableCell>
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
                  disabled={isProcessing || isPending}
                  className="mt-4"
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Process Payments ({paymentsData.length})
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  Натискаючи &ldquo;Process Payments&rdquo;, ви ініціюєте
                  створення або оновлення сервісів для помешкань та відповідних
                  платіжних записів в системі для кожного рядка з таблиці вище.
                  Переконайтеся, що дані коректні.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
