"use client";

import { Button } from "@/components/ui/button";
import crypto from "crypto";

interface PaymentFormProps {
  amount: string;
  currency: string;
  description: string;
  orderId: string;
}

function generateSignature(data: Record<string, string>, secretKey: string) {
  console.log("Generating signature for:", data);
  console.log("Using secret key:", secretKey);

  // Step 1: Filter fields with the "ik_" prefix
  const filteredData = Object.keys(data)
    .filter((key) => key.startsWith("ik_")) // Only take ik_ fields
    .sort() // Step 2: Sort keys alphabetically
    .reduce((acc, key) => {
      acc[key] = data[key]; // Preserve sorted order
      return acc;
    }, {} as Record<string, string>);

  // Step 3: Concatenate values using ":"
  const signString = Object.values(filteredData).join(":") + ":" + secretKey;

  console.log("Concatenated string for signature:", signString);

  // Step 4: Hash with SHA-256 and encode in Base64
  const signature = crypto
    .createHash("sha256")
    .update(signString)
    .digest("base64");

  console.log("Generated signature:", signature);
  return signature;
}

export function PaymentForm({
  amount,
  currency = "UAH",
  description,
  orderId,
}: PaymentFormProps) {
  const ik_co_id = process.env.NEXT_PUBLIC_INTERKASSA_CHECKOUT_ID;
  const secretKey = process.env.NEXT_PUBLIC_INTERKASSA_SECRET_KEY;

  const paymentData = {
    ik_co_id: ik_co_id!,
    ik_pm_no: orderId,
    ik_am: amount,
    ik_cur: currency,
    ik_desc: description,
  };

  const signature = generateSignature(paymentData, secretKey!);

  return (
    <form
      method="POST"
      action="https://sci.interkassa.com/"
      acceptCharset="UTF-8"
    >
      {Object.entries(paymentData).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <input type="hidden" name="ik_sign" value={signature} />
      <Button type="submit">
        Оплатити {amount} {currency}
      </Button>
    </form>
  );
}
