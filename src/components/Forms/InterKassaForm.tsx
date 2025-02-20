"use client";

import { Button } from "@/components/ui/button";
import crypto from "crypto";

interface InterKassaFormProps {
  amount: string;
  currency: string;
  description: string;
  orderId: string;
}

function generateSignature(data: Record<string, string>, secretKey: string) {
  const sortedKeys = Object.keys(data).sort();
  const signString = sortedKeys.map((key) => data[key]).join(":");

  return crypto
    .createHash("md5")
    .update(signString + ":" + secretKey)
    .digest("hex");
}

export function InterKassaForm({
  amount,
  currency = "UAH",
  description,
  orderId,
}: InterKassaFormProps) {
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
