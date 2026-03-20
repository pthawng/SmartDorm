import { ContractStatus } from '../constants';

export interface StatusTheme {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hint: string;
}

export const CONTRACT_STATUS_MAP: Record<ContractStatus, StatusTheme> = {
  [ContractStatus.DRAFT]: {
    label: 'Draft Offer',
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-100',
    hint: 'Chủ nhà đang soạn thảo hợp đồng.'
  },
  [ContractStatus.PENDING_SIGNATURE]: {
    label: 'Awaiting Signature',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
    hint: 'Hợp đồng đang chờ bạn ký xác nhận.'
  },
  [ContractStatus.SIGNED]: {
    label: 'Signed',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-100',
    hint: 'Bạn đã ký. vui lòng thanh toán cọc để kích hoạt.'
  },
  [ContractStatus.DEPOSIT_PAID]: {
    label: 'Deposit Paid',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    hint: 'Đã nhận cọc. Đang chờ chủ nhà xác nhận cuối cùng.'
  },
  [ContractStatus.ACTIVE]: {
    label: 'Active',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
    hint: 'Hợp đồng đang có hiệu lực.'
  },
  [ContractStatus.TERMINATED]: {
    label: 'Terminated',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
    hint: 'Hợp đồng đã chấm dứt.'
  },
  [ContractStatus.EXPIRED]: {
    label: 'Expired',
    color: 'text-slate-400',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
    hint: 'Hợp đồng đã hết hạn.'
  }
};

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export const APPLICATION_STATUS_MAP: Record<ApplicationStatus, StatusTheme> = {
  PENDING: {
    label: 'Reviewing',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
    hint: 'Chủ nhà đang xem xét hồ sơ của bạn.'
  },
  APPROVED: {
    label: 'Accepted',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    hint: 'Hồ sơ đã được duyệt! Vui lòng kiểm tra hợp đồng.'
  },
  REJECTED: {
    label: 'Not Accepted',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
    hint: 'Rất tiếc, hồ sơ của bạn không phù hợp lần này.'
  }
};
