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
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Обов'язкове поле" }),
  description: z.string().min(1, { message: "Обов'язкове поле" }),
  price: z.coerce.number().min(1, { message: "Обов'язкове поле" }),
  // price: z.string().min(1, { message: "Обов'язкове поле" }),
  logo: z.string().min(1, { message: "Обов'язкове поле" }),
});

export default function AddTariffCard() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      const result = await createServiceAction(formData);

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Не вдалося створити тариф",
        });
      } else {
        toast({ variant: "default", title: "Тариф успішно створено" });
        setOpen(false);
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.error("Сталася помилка", error);
    }
  }

  return (
    <Card className="p-3 flex flex-col items-center justify-center space-y-4 w-[350px]">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-20 h-20 rounded-full">
            <CirclePlus className="w-8 h-8" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Створення тарифу</DialogTitle>
            <DialogDescription>
              Введіть необхідну інформацію щоб створити статтю нарахувань
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 max-w-3xl mx-auto "
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Назва</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Водовідведення"
                        type="text"
                        {...field}
                      />
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
                      <Input
                        placeholder="За лічильником..."
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ціна</FormLabel>
                        <FormControl>
                          <Input placeholder="20" type="" {...field} />
                        </FormControl>
                        <FormDescription>Ціна в грн</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Іконка</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" type="" {...field} />
                        </FormControl>
                        <FormDescription>Оберіть логотип</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="justify-self-end">
                Додати Тариф
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Додати статтю нарахувань
      </p>
    </Card>
  );
}
