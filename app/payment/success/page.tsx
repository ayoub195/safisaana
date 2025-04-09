'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle } from 'lucide-react';

interface PaymentData {
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentId = searchParams.get('id');
    if (!paymentId) return;

    const fetchPayment = async () => {
      try {
        const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
        if (paymentDoc.exists()) {
          setPayment(paymentDoc.data() as PaymentData);
        }
      } catch (error) {
        console.error('Error fetching payment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Payment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your payment of {payment.currency} {payment.amount}
        </p>
        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
} 