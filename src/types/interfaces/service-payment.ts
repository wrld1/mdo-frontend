import { PaymentStatus } from "../enums/paymentStatus";

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

export interface CreateServicePaymentDto {
  month: number;
  year: number;
  amount?: number;
  counter: number;
  status?: PaymentStatus;
}

export interface AddPaymentRequest {
  dwellingServiceId?: number;
  dwellingId?: number;
  serviceId?: number;
  payment: CreateServicePaymentDto;
}

export interface PaymentProcessingResult {
  success?: boolean;
  payment?: ServicePayment;
  error?: string;
  details?: string;
  request?: AddPaymentRequest;
  dwellingServiceId?: number;
  dwellingId?: number;
  serviceId?: number;
}

export interface AddPaymentsResponse {
  message: string;
  processedCount: number;
  totalRequests: number;
  results: PaymentProcessingResult[];
}
