export interface ServicePayment {
  id: number;
  startDate: string;
  endDate: string;
  amount: number;
  counter: number;
  status: string;
  paymentDate: string | null;
  createdAt: string;
  updatedAt: string;
  dwellingServiceId: number;
}
