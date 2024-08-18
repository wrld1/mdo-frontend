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

const passwordValidation = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
);

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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email, password } = data;
    const urlToSend = "http://localhost:3000";
    try {
      const response = await fetch(`${urlToSend}/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      toast({
        title: "Registration Successful",
        description: "You have successfully signed up.",
      });

      console.log("Success:", result);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during sign-up.",
      });
      console.error("Error:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 ">
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
