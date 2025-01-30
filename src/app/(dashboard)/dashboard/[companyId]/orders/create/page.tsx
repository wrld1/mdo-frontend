"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { createServiceAction } from "@/actions/service/create-service-action";
import { useParams, useRouter } from "next/navigation";
import { createOrderAction } from "@/actions/order/create-order-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Назва обов'язкова"),
  description: z.string().min(1, "Опис обов'язковий"),
  type: z.enum(["ELECTRICITY", "WATER", "GAS", "OTHER"] as const),
  objectId: z.string().min(1, "Об'єкт обов'язковий"),
  //   dwellingId: z.number().optional(),
  userId: z.number(),
  responsibleUserId: z.number().optional(),
});

export default function CreateOrderPage() {
  const params = useParams();
  const companyId = Array.isArray(params.companyId)
    ? params.companyId[0]
    : params.companyId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      const result = await createOrderAction(formData, companyId);

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Не вдалося створити заявку",
        });
      } else {
        toast({ variant: "default", title: "Заявку успішно створено" });
        form.reset();
      }
    } catch (error) {
      console.error("Сталася помилка", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-3xl mx-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Назва</FormLabel>
              <FormControl>
                <Input placeholder="Водовідведення" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Опис</FormLabel>
              <FormControl>
                <Textarea placeholder="Опис проблеми..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип заявки</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть тип заявки" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ELECTRICITY">Електрика</SelectItem>
                  <SelectItem value="WATER">Вода</SelectItem>
                  <SelectItem value="GAS">Газ</SelectItem>
                  <SelectItem value="OTHER">Інше</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="objectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Об&apos;єкт</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть об'єкт" />
                    </SelectTrigger>
                    <SelectContent>{/* Add objects from API */}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* <div className="col-span-6">
            <FormField
              control={form.control}
              name="dwellingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Помешкання</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть помешкання" />
                    </SelectTrigger>
                    <SelectContent>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
        </div>

        <Button type="submit">Створити заявку</Button>
      </form>
    </Form>
  );
}
