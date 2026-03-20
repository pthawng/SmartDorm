import { ContractStatus } from '../constants';

/**
 * Lifecycle Guards — Ensuring legal state transitions.
 * Prevents impossible jumps (e.g. from DRAFT direct to ACTIVE).
 */
export const VALID_TRANSITIONS: Record<ContractStatus, ContractStatus[]> = {
  [ContractStatus.DRAFT]: [ContractStatus.PENDING_SIGNATURE],
  [ContractStatus.PENDING_SIGNATURE]: [ContractStatus.SIGNED, ContractStatus.DRAFT],
  [ContractStatus.SIGNED]: [ContractStatus.DEPOSIT_PAID, ContractStatus.DRAFT],
  [ContractStatus.DEPOSIT_PAID]: [ContractStatus.ACTIVE, ContractStatus.DRAFT],
  [ContractStatus.ACTIVE]: [ContractStatus.TERMINATED, ContractStatus.EXPIRED],
  [ContractStatus.TERMINATED]: [],
  [ContractStatus.EXPIRED]: [],
};

export function canTransitionTo(current: ContractStatus, target: ContractStatus): boolean {
  const allowed = VALID_TRANSITIONS[current] || [];
  return allowed.includes(target);
}

/**
 * UX Context Guards
 */
export const isTenantActionRequired = (status: ContractStatus): boolean => {
  return [
    ContractStatus.PENDING_SIGNATURE, 
    ContractStatus.SIGNED
  ].includes(status);
};

export const isLandlordActionRequired = (status: ContractStatus): boolean => {
  return [
    ContractStatus.DRAFT, 
    ContractStatus.DEPOSIT_PAID
  ].includes(status);
};
