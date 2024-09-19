"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface ToastHandlerProps {
  showVerificationToast: boolean;
}

export default function ToastHandler({
  showVerificationToast,
}: ToastHandlerProps) {
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (showVerificationToast) {
      toast({
        title: "Верифікація акаунту",
        description: "Щоб перейти на сторінку треба підтвердити акаунт",
        duration: 5000,
      });
    }
  }, [showVerificationToast, toast, router]);

  return null;
}
