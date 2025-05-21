export interface ServicePayment {
  id: number;
  month: number;
  year: number;
  amount: number;
  counter: number;
  status: string;
  paymentDate: string | null;
  createdAt: string;
  updatedAt: string;
  dwellingServiceId: number;
}
