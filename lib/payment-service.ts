import 'intasend-inlinejs-sdk';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

interface PaymentConfig {
  amount: number;
  currency: string;
  customerId: string;
  courseId?: string;
  productId?: string;
}

export class PaymentService {
  private static instance: PaymentService;
  private intaSend: any;

  private constructor() {
    // Initialize IntaSend with live credentials
    this.intaSend = new window.IntaSend({
      publicKey: process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY,
      live: true, // Using live mode since we have live credentials
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/intasend`
    });
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async initiatePayment(config: PaymentConfig) {
    try {
      // Create a payment record in Firestore first
      const paymentRef = await addDoc(collection(db, 'payments'), {
        amount: config.amount,
        currency: config.currency,
        customerId: config.customerId,
        courseId: config.courseId,
        productId: config.productId,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        environment: 'live' // Track that this is a live payment
      });

      // Setup IntaSend payment
      this.intaSend
        .on("COMPLETE", async (results: any) => {
          // Update payment record on success
          await updateDoc(doc(db, 'payments', paymentRef.id), {
            status: 'COMPLETE',
            transactionId: results.id,
            paymentMethod: results.payment_method,
            updatedAt: new Date().toISOString(),
            metadata: results
          });

          // Create notification
          await addDoc(collection(db, 'notifications'), {
            userId: config.customerId,
            title: 'Payment Successful',
            message: `Your payment of ${config.currency} ${config.amount} was successful`,
            type: 'success',
            isRead: false,
            createdAt: new Date().toISOString()
          });

          // Redirect to success page
          window.location.href = `/payment/success?id=${paymentRef.id}`;
        })
        .on("FAILED", async (results: any) => {
          // Update payment record on failure
          await updateDoc(doc(db, 'payments', paymentRef.id), {
            status: 'FAILED',
            error: results.error,
            updatedAt: new Date().toISOString(),
            metadata: results
          });

          // Create notification
          await addDoc(collection(db, 'notifications'), {
            userId: config.customerId,
            title: 'Payment Failed',
            message: `Your payment of ${config.currency} ${config.amount} failed`,
            type: 'error',
            isRead: false,
            createdAt: new Date().toISOString()
          });

          // Redirect to failure page
          window.location.href = `/payment/failed?id=${paymentRef.id}`;
        })
        .on("IN-PROGRESS", async (results: any) => {
          // Update payment status
          await updateDoc(doc(db, 'payments', paymentRef.id), {
            status: 'IN_PROGRESS',
            updatedAt: new Date().toISOString(),
            metadata: results
          });
        });

      return paymentRef.id;
    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw error;
    }
  }
} 