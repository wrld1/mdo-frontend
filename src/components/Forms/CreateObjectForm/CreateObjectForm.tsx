"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { createObjectAction } from "@/actions/create-object-action";
import { ObjectType } from "@/types/types/object";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  address: z.string(),
  type: z.enum(["ApartmentBuilding"] as const) satisfies z.ZodType<ObjectType>,
});

export default function CreateObjectForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const modifiedValues = {
      address: values.address,
      type: values.type,
      //TODO: Remove hardcoded value
      companyId: "5486555a-0da1-490c-baca-4b9c34c31295",
    };

    try {
      const response = await createObjectAction(modifiedValues);

      console.log(values);
      toast({
        title: "Об'єкт створено успішно",
        description: "Your object has been successfully created.",
      });
      router.push("/dashboard/objects");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to submit the form. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 min-w-[50%] max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адреса об'єкта</FormLabel>
              <FormControl>
                <Input
                  placeholder="вул. Героїв Дніпра, 24"
                  type=""
                  {...field}
                />
              </FormControl>
              <FormDescription>Введіть адресу об'єкта</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип об'єкта</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть тип об'єкта" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ApartmentBuilding">
                    Багатоквартирний будинок
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Оберіть тип об'єкта</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Створити</Button>
      </form>
    </Form>
  );
}