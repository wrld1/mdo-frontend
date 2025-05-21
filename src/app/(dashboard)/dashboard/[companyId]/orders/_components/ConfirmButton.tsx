"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateOrderAction } from "@/actions/order/update-order-action";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ConfirmOwnershipButtonProps {
  orderId: string;
}

export function ConfirmButton({ orderId }: ConfirmOwnershipButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const result = await updateOrderAction(orderId, {
      orderStatus: "FINISHED",
    });

    if ("error" in result) {
      toast({
        title: "Error",
        description: `Помилка: ${result.error}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Успішно",
        description: "Статус заявки оновлено на 'FINISHED'",
      });
    }
    setIsLoading(false);
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Підтвердити володіння
    </Button>
  );
}
