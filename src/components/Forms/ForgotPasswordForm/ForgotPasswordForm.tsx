"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { sendResetLinkAction } from "@/actions/auth/send-reset-link-action";

const FormSchema = z.object({
  email: z.string().email({
    message: "Введіть корректну Email адресу",
  }),
});

function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await sendResetLinkAction(data);

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Не вдалося відправити посилання",
        description: result.error,
      });
    } else {
      toast({
        title: "Посилання відправлено",
        description: "Перейдіть за ним щоб змінити пароль",
      });
    }

    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Введіть Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-center">
          <Button type="submit">Відправити</Button>
        </div>
      </form>
    </Form>
  );
}

export default ForgotPasswordForm;
