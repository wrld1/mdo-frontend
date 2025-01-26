"use client";

import { sendVerificationAction } from "@/actions/auth/send-verification-action";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface EmailRowProps {
  userIsVerified: boolean | undefined;
  userEmail: string;
}

export default function EmailRow({ userIsVerified, userEmail }: EmailRowProps) {
  async function handleOnClick() {
    const result = await sendVerificationAction({ email: userEmail });

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Не вдалося відправити email для підтвердження",
        description: result.error,
      });
    } else {
      toast({
        title: "Email відправлено",
        description: "Перейдіть за посиланням в листі щоб підтвердити акаунт",
      });
    }
  }

  return (
    <div className="flex items-center justify-between">
      <span>Email</span>
      <Button
        variant={userIsVerified ? "outline" : "default"}
        size="sm"
        disabled={userIsVerified}
        onClick={async () => {
          await handleOnClick();
        }}
      >
        {userIsVerified ? "Пошту підтверджено" : "Підтвердіть пошту"}
      </Button>
    </div>
  );
}
