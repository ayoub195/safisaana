import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PaymentService } from '@/lib/payment-service';

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  courseId?: string;
  productId?: string;
  className?: string;
}

export default function PaymentButton({
  amount,
  currency = 'KES',
  courseId,
  productId,
  className = ''
}: PaymentButtonProps) {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize payment service
    const paymentService = PaymentService.getInstance();
  }, []);

  const handlePayment = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = `/auth/login?redirect=${window.location.pathname}`;
      return;
    }

    try {
      const paymentService = PaymentService.getInstance();
      await paymentService.initiatePayment({
        amount,
        currency,
        customerId: user.uid,
        courseId,
        productId
      });
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className={`intaSendPayButton inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium ${className}`}
      data-amount={amount}
      data-currency={currency}
    >
      Pay Now
    </button>
  );
} 