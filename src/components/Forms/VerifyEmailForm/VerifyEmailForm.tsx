"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyAccountAction } from "@/actions/verify-account-action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  token: z.string().min(1, "Сталася помилка"),
});

type FormData = z.infer<typeof formSchema>;

function VerifyEmailForm() {
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyToken = searchParams.get("token");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: verifyToken || "",
    },
  });

  async function onSubmit(data: FormData) {
    const result = await verifyAccountAction(data);
    setIsVerifying(true);

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Не вдалося підтвердити акаунт",
        description: result.error,
      });
    } else {
      toast({
        title: "Акаунт підтверджено",
      });
      router.push("/profile/settings");
    }
    setIsVerifying(false);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Підтвердити акаунт</CardTitle>
        <CardDescription>
          Натисніть кнопку нижче щоб підтвердити ваш акаунт
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="token">Verification Token</Label>
              <Input
                id="token"
                name="token"
                type="hidden"
                value={verifyToken || ""}
              />
              <p className="text-sm text-muted-foreground">
                {verifyToken ? "Token received" : "No token provided"}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isVerifying || !verifyToken}>
            {isVerifying ? "Підтвердження..." : "Підтвердити"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default VerifyEmailForm;
