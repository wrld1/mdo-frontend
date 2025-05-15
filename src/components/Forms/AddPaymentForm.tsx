"use client";

import { useTransition } from "react";
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
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addMonths } from "date-fns";
import { cn } from "@/lib/utils";

import {
  addPaymentAction,
  CreateServicePaymentDto,
} from "@/actions/service/create-service-payment.action";

const paymentFormSchema = z.object({
  dateRange: z
    .object({
      from: z.date({ required_error: "Дата початку періоду обов'язкова" }),
      to: z.date({ required_error: "Дата кінця періоду обов'язкова" }),
    })
    .refine((data) => data.from && data.to, {
      message: "Необхідно обрати повний період (початок та кінець).",
      path: ["from"],
    })
    .refine(
      (data) => {
        if (data.from && data.to) {
          return data.from <= data.to;
        }
        return true;
      },
      {
        message: "Дата початку не може бути пізніше дати завершення.",
        path: ["from"],
      }
    ),
  counter: z.coerce
    .number()
    .nonnegative("Показник лічильника не може бути негативним"),
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
      dateRange: {
        from: new Date(),
        to: addMonths(new Date(), 1),
      },
      counter: 0,
    },
  });

  const onSubmit = (values: PaymentFormValues) => {
    startTransition(async () => {
      if (!values.dateRange.from || !values.dateRange.to) {
        toast({
          variant: "destructive",
          title: "Помилка: Неповний період дат.",
        });
        return;
      }

      const payload: CreateServicePaymentDto = {
        counter: values.counter,
        startDate: values.dateRange.from.toISOString(),
        endDate: values.dateRange.to.toISOString(),
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
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Період платежу</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      id="dateRange"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} -{" "}
                            {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Оберіть період</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={field.value}
                    onSelect={field.onChange}
                    numberOfMonths={2}
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
