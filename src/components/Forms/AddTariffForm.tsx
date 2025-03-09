"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { createServiceAction } from "@/actions/service/create-service-action";
import { Object } from "@/types/interfaces/object";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Обов'язкове поле" }),
  description: z.string().min(1, { message: "Обов'язкове поле" }),
  price: z.coerce.number().min(1, { message: "Обов'язкове поле" }),
  logo: z.string().min(1, { message: "Обов'язкове поле" }),
  objectId: z.string(),
});

interface AddTariffFormProps {
  objects: Object[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddTariffForm({
  objects,
  onSuccess,
  onCancel,
}: AddTariffFormProps) {
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
        form.reset();
        router.refresh();
        onSuccess?.();
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
                <Input placeholder="Водовідведення" type="text" {...field} />
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
                <Input placeholder="За лічильником..." type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Об&apos;єкт</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть об'єкт" />
                </SelectTrigger>
                <SelectContent>
                  {objects.map((object) => (
                    <SelectItem key={object.id} value={object.id}>
                      {object.address}
                    </SelectItem>
                  ))}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ціна</FormLabel>
                  <FormControl>
                    <Input placeholder="20" type="number" {...field} />
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
                    <Input placeholder="shadcn" type="text" {...field} />
                  </FormControl>
                  <FormDescription>Оберіть логотип</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
          )}
          <Button type="submit">Додати Тариф</Button>
        </div>
      </form>
    </Form>
  );
}
