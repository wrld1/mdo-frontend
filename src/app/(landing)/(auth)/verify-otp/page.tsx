// src/app/(landing)/(auth)/verify-otp/page.tsx
"use client";

import { verifyOtpAction } from "@/actions/auth/verify-otp-action";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const otpSchema = z.object({
  otpCode: z.string().length(6, {
    message: "Код підтвердження має містити 6 цифр",
  }),
});

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Помилка верифікації",
        description: "Необхідно спочатку увійти за допомогою номера телефону",
      });
      router.push("/sign-in");
    }
  }, [userId, router]);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });

  async function onSubmit(data: z.infer<typeof otpSchema>) {
    if (!userId) return;

    try {
      const result = await verifyOtpAction({
        userId: parseInt(userId),
        otpCode: data.otpCode,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Помилка верифікації",
          description: result.error,
        });
      } else {
        toast({
          title: "Верифікація успішна",
          description: "Ви успішно увійшли в систему",
        });
        router.push("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Помилка верифікації",
        description: "Щось пішло не так. Спробуйте ще раз.",
      });
    }
  }

  return (
    <div className="container min-h-full flex items-center justify-center flex-col">
      <div className="space-y-4 text-center mb-6">
        <h1 className="text-3xl font-bold">Верифікація коду</h1>
        <p className="text-muted-foreground">
          Введіть код підтвердження, надісланий на ваш телефон
        </p>
      </div>
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otpCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Код підтвердження</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Введіть 6-значний код, який був надісланий на ваш телефон
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-center">
              <Button type="submit">Підтвердити</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}