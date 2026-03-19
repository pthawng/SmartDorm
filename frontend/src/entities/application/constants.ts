import { ApplicationStatus } from './types';

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'Pending Review',
  [ApplicationStatus.APPROVED]: 'Application Approved',
  [ApplicationStatus.REJECTED]: 'Application Declined',
  [ApplicationStatus.CANCELED]: 'Withdrawn',
};

export const APPLICATION_STATUS_DESCRIPTION: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'Your application is being carefully reviewed by the property manager. We will notify you once a decision is finalized.',
  [ApplicationStatus.APPROVED]: 'Congratulations! Your application has been approved. Please proceed to review and sign your lease agreement.',
  [ApplicationStatus.REJECTED]: 'We regret to inform you that your application was not successful at this time.',
  [ApplicationStatus.CANCELED]: 'You have successfully withdrawn your lease application.',
};
