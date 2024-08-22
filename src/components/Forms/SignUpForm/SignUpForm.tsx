"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { signUpAction } from "@/actions/sign-up-action";
import { useRouter } from "next/navigation";
import { passwordValidation } from "@/lib/constants";

const FormSchema = z
  .object({
    email: z.string().email({
      message: "Введіть корректну Email адресу",
    }),
    password: z
      .string()
      .min(8, { message: "Має містити щонайменше 8 символів" })
      .regex(passwordValidation, {
        message: "Некоректний пароль",
      }),
    repeatPassword: z
      .string()
      .min(8, { message: "Має містити щонайменше 8 символів" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Паролі мають співпадати",
  });

function SignUpForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await signUpAction(data);

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Не вдалося зареєструватись",
        description: result.error,
      });
    } else {
      toast({
        title: "Реєстрація успішна",
        description: "Ви успішно зареєструвались у системі",
      });
      router.push("/sign-in");
    }
  }

  return (
    <Form {...form}>
      <form className="w-2/3 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input placeholder="Введіть Пароль" {...field} />
              </FormControl>
              <FormDescription>
                Мінімум 8 символів, 1 велика, 1 мала літера та 1 цифра.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Повторіть пароль</FormLabel>
              <FormControl>
                <Input placeholder="Введіть Пароль" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-center">
          <Button type="submit">Зареєструватись</Button>
        </div>
      </form>
    </Form>
  );
}

export default SignUpForm;
