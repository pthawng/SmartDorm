import type { ID, ISOString } from '@/shared/types/common';

export type PaymentMethod = 'QR_CODE' | 'BANK_TRANSFER' | 'CREDIT_CARD';

export interface DepositPaymentInfo {
  contract_id: ID;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  payment_method?: PaymentMethod;
  paid_at?: ISOString;
}
