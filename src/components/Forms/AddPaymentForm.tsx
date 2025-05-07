"use client";

import { useState, useTransition } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  PaymentStatus,
  Status as PaymentStatusEnumObject,
} from "@/types/enums/paymentStatus";
import {
  addPaymentAction,
  CreateServicePaymentDto,
} from "@/actions/service/create-service-payment.action";

const paymentFormSchema = z.object({
  startDate: z.string().min(1, "Початкова дата обов'язкова"),
  endDate: z.string().min(1, "Кінцева дата обов'язкова"),
  amount: z.coerce.number().positive("Сума повинна бути позитивною"),
  counter: z.coerce
    .number()
    .nonnegative("Показник лічильника не може бути негативним"),
  status: z
    .enum(
      Object.values(PaymentStatusEnumObject) as [
        PaymentStatus,
        ...PaymentStatus[]
      ]
    )
    .optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface AddPaymentFormProps {
  dwellingServiceId: number;
}

export function AddPaymentForm({ dwellingServiceId }: AddPaymentFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split("T")[0],
      amount: 0,
      counter: 0,
      status: PaymentStatusEnumObject.PENDING,
    },
  });

  const onSubmit = (values: PaymentFormValues) => {
    startTransition(async () => {
      const payload: CreateServicePaymentDto = {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      };
      const result = await addPaymentAction(dwellingServiceId, payload);
      if ("error" in result) {
        toast({
          variant: "destructive",
          title: `Помилка створення платежу: ${result.error}`,
        });
      } else {
        toast({ variant: "default", title: "Платіж успішно додано!" });
        form.reset();
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
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата початку періоду</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата кінця періоду</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сума до сплати (грн)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
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
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Статус</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть статус" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(PaymentStatusEnumObject).map((statusValue) => (
                    <SelectItem key={statusValue} value={statusValue}>
                      {statusValue}{" "}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
