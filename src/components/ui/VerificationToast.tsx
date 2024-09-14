"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export default function VerificationToast({
  needsVerification,
}: {
  needsVerification: string | undefined;
}) {
  const { toast } = useToast();
  const router = useRouter();

  // const verificationCheck = needsVerification === "true" ? true : false;

  useEffect(() => {
    const checkVerificationStatus = () => {
      // const needsVerification = true;

      if (!!needsVerification) {
        router.refresh();

        toast({
          title: "Verification Required",
          description:
            "A verification link has been sent to your email. Please check your inbox and verify your account.",
          duration: 5000,
        });

        // Clear the verification flag
        document.cookie =
          "needsVerification=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      }
    };

    checkVerificationStatus();
  }, [toast, router]);

  return <p>tesatataewtaad</p>;
}
