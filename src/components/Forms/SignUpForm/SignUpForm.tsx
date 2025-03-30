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
import { signUpAction } from "@/actions/auth/sign-up-action";
import { useRouter } from "next/navigation";
import { passwordValidation, phoneRegex } from "@/lib/constants";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

const passwordSchema = z
  .string()
  .min(8, { message: "Має містити щонайменше 8 символів" })
  .regex(passwordValidation, {
    message: "Некоректний пароль",
  });

const repeatPasswordSchema = z
  .string()
  .min(8, { message: "Має містити щонайменше 8 символів" });

const emailSchema = z
  .object({
    email: z.string().email({
      message: "Введіть корректну Email адресу",
    }),
    password: passwordSchema,
    repeatPassword: repeatPasswordSchema,
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Паролі мають співпадати",
  });

const phoneSchema = z
  .object({
    phoneNumber: z.string().regex(phoneRegex, {
      message: "Введіть корректний номер телефону",
    }),
    password: passwordSchema,
    repeatPassword: repeatPasswordSchema,
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Паролі мають співпадати",
  });

const getFormSchema = (authType: "email" | "phone") => {
  return authType === "email" ? emailSchema : phoneSchema;
};

interface SignUpFormProps {
  authType: "email" | "phone";
}

function SignUpForm({ authType }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false);

  const FormSchema = getFormSchema(authType);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...(authType === "email" ? { email: "" } : { phoneNumber: "" }),
      password: "",
      repeatPassword: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const submitData = {
      ...data,
      authType,
    };

    const result = await signUpAction(submitData);

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
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {authType === "email" ? (
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
        ) : (
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Номер телефону</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+380XXXXXXXXX" {...field} />
                </FormControl>
                <FormDescription>
                  Введіть номер телефону у форматі +380XXXXXXXXX
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Введіть Пароль"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
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
                <div className="relative">
                  <Input
                    type={showRepeatPassword ? "text" : "password"}
                    placeholder="Повторіть Пароль"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowRepeatPassword((prev) => !prev)}
                  >
                    {showRepeatPassword ? (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {showRepeatPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
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
