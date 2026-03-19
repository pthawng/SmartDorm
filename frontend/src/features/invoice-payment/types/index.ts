export type PaymentMethod = 'bank_transfer' | 'cash' | 'e_wallet';

export interface PaymentRequest {
  invoiceId: string;
  method: PaymentMethod;
}

export interface PaymentReference {
  transactionId: string;
  method: PaymentMethod;
  timestamp: string;
}
