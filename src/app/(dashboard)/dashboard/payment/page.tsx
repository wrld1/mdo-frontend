import { InterKassaForm } from "@/components/Forms/InterKassaForm";

export default function PaymentPage() {
  const paymentData = {
    amount: "100.00",
    currency: "UAH",
    description: "Payment for services",
    orderId: "ORDER_" + Date.now(),
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Оплата послуг</h1>
      <div className="max-w-md mx-auto">
        <InterKassaForm {...paymentData} />
      </div>
    </div>
  );
}
