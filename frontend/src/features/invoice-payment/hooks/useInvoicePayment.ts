import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInvoiceForPayment, processInvoicePayment } from '../services/invoice-payment-api';
import { PaymentMethod, PaymentRequest, PaymentReference } from '../types';
import { toast } from 'sonner';

/**
 * Hook to manage the state and orchestrate the flow of an invoice payment.
 */
export function useInvoicePayment(invoiceId: string) {
  const queryClient = useQueryClient();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentReference, setPaymentReference] = useState<PaymentReference | null>(null);

  // Fetch invoice details
  const { data: invoice, isLoading, isError, error } = useQuery({
    queryKey: ['invoice-payment', invoiceId],
    queryFn: () => getInvoiceForPayment(invoiceId),
    enabled: !!invoiceId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle actual payment processing
  const { mutate: payInvoice, isPending: isSubmitting } = useMutation({
    mutationFn: (request: PaymentRequest) => processInvoicePayment(request),
    onSuccess: (paymentRef) => {
      // Invalidate the invoice queries so that other screens reflect the PAID status
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] });
      queryClient.invalidateQueries({ queryKey: ['invoice-payment', invoiceId] });

      setPaymentReference(paymentRef);
      
      toast.success(
        `Payment successful via ${paymentRef.method.replace('_', ' ').toUpperCase()}`, 
        { description: `Reference: ${paymentRef.transactionId}` }
      );
    },
    onError: () => {
      toast.error('Payment processing failed. Please try again.');
    }
  });

  const onPay = () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method before proceeding.');
      return;
    }
    
    payInvoice({ invoiceId, method: selectedMethod });
  };

  return {
    invoice,
    selectedMethod,
    setMethod: setSelectedMethod,
    onPay,
    isLoading,
    isSubmitting,
    isSuccess: !!paymentReference,
    paymentReference,
    isError,
    error,
  };
}
