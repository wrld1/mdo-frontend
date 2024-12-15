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

import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { createDwellingAction } from "@/actions/create-dwelling-action";

const formSchema = z.object({
  number: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "Number must be a valid number",
    }),

  floor: z
    .string()
    .optional()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val)),

  entrance: z
    .string()
    .optional()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val)),
});

export default function CreateDwellingForm({ objectId }: { objectId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const modifiedValues = { ...values, objectId };

      const response = await createDwellingAction(modifiedValues);

      console.log(values);
      toast({
        title: "Квартиру додано успішно",
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
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер квартири</FormLabel>
              <FormControl>
                <Input placeholder="46" type="number" {...field} />
              </FormControl>
              <FormDescription>Введіть номер квартири</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="floor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер поверху</FormLabel>
              <FormControl>
                <Input placeholder="4" type="number" {...field} />
              </FormControl>
              <FormDescription>Введіть номер поверху</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="entrance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер поверху</FormLabel>
              <FormControl>
                <Input placeholder="2" type="number" {...field} />
              </FormControl>
              <FormDescription>Введіть номер під'їзду</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Створити</Button>
      </form>
    </Form>
  );
}
