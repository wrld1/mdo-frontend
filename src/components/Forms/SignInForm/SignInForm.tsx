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
import { signInAction } from "@/actions/auth/sign-in-action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { phoneRegex } from "@/lib/constants";


const emailSchema = z.object({
  email: z.string().email({
    message: "Введіть корректну Email адресу",
  }),
  password: z.string().nonempty({
    message: "Пароль не може бути порожнім",
  }),
});

const phoneSchema = z.object({
  phoneNumber: z.string().regex(phoneRegex, {
    message: "Введіть корректний номер телефону",
  }),
  password: z.string().nonempty({
    message: "Пароль не може бути порожнім",
  }),
});

const getFormSchema = (authType: "email" | "phone") => {
  return authType === "email" ? emailSchema : phoneSchema;
};

interface SignInFormProps {
  authType: "email" | "phone";
}

function SignInForm({ authType }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const FormSchema = getFormSchema(authType);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...(authType === "email" ? { email: "" } : { phoneNumber: "" }),
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const submitData = {
      ...data,
      authType,
    };

    const result = await signInAction(submitData);

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Не вдалося увійти",
        description: result.error,
      });
    } else if (authType === "phone" && result?.otpSent && result?.userId) {
      toast({
        title: "Код підтвердження надіслано",
        description: "Введіть код, який ви отримали по SMS",
      });
      
      router.push(`/verify-otp?userId=${result.userId}`);
    } else {
      toast({
        title: "Авторизація успішна",
        description: "Ви успішно увійшли в систему",
      });
      router.push("/");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-center">
          <Button type="submit">Увійти</Button>
        </div>
      </form>
    </Form>
  );
}

export default SignInForm;
