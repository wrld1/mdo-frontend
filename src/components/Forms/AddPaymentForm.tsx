"use client";

import { useEffect, useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { addPaymentAction } from "@/actions/service/create-service-payment.action";
import { MonthPicker } from "../ui/monthpicker";
import {
  CreateServicePaymentDto,
  ServicePayment,
} from "@/types/interfaces/service-payment";
import { useRouter } from "next/navigation";

const paymentFormSchema = z.object({
  selectedMonth: z.date({
    required_error: "Необхідно обрати місяць та рік.",
  }),
  counter: z.coerce
    .number()
    .nonnegative("Показник лічильника не може бути негативним"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface AddPaymentFormProps {
  dwellingServiceId: number;
  existingPayments: ServicePayment[];
}

export function AddPaymentForm({
  dwellingServiceId,
  existingPayments,
}: AddPaymentFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      selectedMonth: new Date(),
      counter: 0,
    },
  });

  const paidMonthsDates = useMemo(() => {
    return existingPayments.map(
      (payment) => new Date(payment.year, payment.month - 1)
    );
  }, [existingPayments]);

  const selectedMonthValue = form.watch("selectedMonth");

  const isCurrentMonthPaid = useMemo(() => {
    if (!selectedMonthValue) return false;
    return paidMonthsDates.some(
      (paidDate) =>
        paidDate.getFullYear() === selectedMonthValue.getFullYear() &&
        paidDate.getMonth() === selectedMonthValue.getMonth()
    );
  }, [selectedMonthValue, paidMonthsDates]);

  useEffect(() => {
    if (isCurrentMonthPaid) {
      form.setError("selectedMonth", {
        type: "manual",
        message: "Платіж за цей місяць вже існує.",
      });
    } else {
      form.clearErrors("selectedMonth");
    }
  }, [isCurrentMonthPaid, form, selectedMonthValue]);

  const onSubmit = (values: PaymentFormValues) => {
    if (isCurrentMonthPaid) {
      toast({
        variant: "destructive",
        title: "Помилка: Платіж вже існує",
        description: "Платіж за обраний місяць та рік вже було додано.",
      });
      form.setError("selectedMonth", {
        type: "manual",
        message: "Платіж за цей місяць вже існує.",
      });
      return;
    }

    startTransition(async () => {
      if (!values.selectedMonth) {
        toast({
          variant: "destructive",
          title: "Помилка: Місяць не обрано.",
        });
        return;
      }

      const payload: CreateServicePaymentDto = {
        counter: values.counter,
        month: values.selectedMonth.getMonth() + 1,
        year: values.selectedMonth.getFullYear(),
      };
      const result = await addPaymentAction(dwellingServiceId, payload);
      if ("error" in result) {
        toast({
          variant: "destructive",
          title: "Помилка створення платежу",
          description: result.error,
        });
      } else {
        toast({
          variant: "default",
          title: result.message,
        });
        form.reset();
        router.refresh();
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-4 border rounded-md"
      >
        <h3 className="text-lg font-medium">Додати новий платіж</h3>
        <FormField
          control={form.control}
          name="selectedMonth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Місяць та Рік платежу</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                        form.formState.errors.selectedMonth &&
                          "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "MMMM yyyy")
                      ) : (
                        <span>Оберіть місяць</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <MonthPicker
                    selectedMonth={field.value}
                    onMonthSelect={(date) => {
                      field.onChange(date);
                    }}
                    disabledDates={paidMonthsDates}
                    minDate={new Date(new Date().getFullYear() - 15, 0)}
                    maxDate={new Date(new Date().getFullYear() + 1, 11)}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="counter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Показник лічильника</FormLabel>
              <FormControl>
                <Input type="number" step="0.001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Додати платіж
        </Button>
      </form>
    </Form>
  );
}
