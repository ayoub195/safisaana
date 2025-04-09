import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import crypto from 'crypto';

// Verify webhook signature
function verifySignature(payload: any, signature: string | null): boolean {
  if (!signature) return false;

  const webhookSecret = process.env.INTASEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Webhook secret not configured');
    return false;
  }

  const hmac = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return hmac === signature;
}

// Handle different payment statuses
async function handlePaymentUpdate(paymentId: string, status: string, metadata: any) {
  try {
    // Get the payment document
    const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
    if (!paymentDoc.exists()) {
      throw new Error('Payment not found');
    }

    const payment = paymentDoc.data();

    // Update payment status
    await updateDoc(doc(db, 'payments', paymentId), {
      status,
      updatedAt: new Date().toISOString(),
      webhookMetadata: metadata
    });

    // Create notification
    await addDoc(collection(db, 'notifications'), {
      userId: payment.customerId,
      title: getNotificationTitle(status),
      message: getNotificationMessage(status, payment.currency, payment.amount),
      type: status === 'COMPLETE' ? 'success' : status === 'FAILED' ? 'error' : 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Error handling payment update:', error);
    return false;
  }
}

// Get notification title based on status
function getNotificationTitle(status: string): string {
  switch (status) {
    case 'COMPLETE':
      return 'Payment Successful';
    case 'FAILED':
      return 'Payment Failed';
    case 'REFUNDED':
      return 'Payment Refunded';
    case 'DISPUTED':
      return 'Payment Disputed';
    default:
      return 'Payment Update';
  }
}

// Get notification message based on status
function getNotificationMessage(status: string, currency: string, amount: number): string {
  switch (status) {
    case 'COMPLETE':
      return `Your payment of ${currency} ${amount} was successful`;
    case 'FAILED':
      return `Your payment of ${currency} ${amount} failed`;
    case 'REFUNDED':
      return `Your payment of ${currency} ${amount} has been refunded`;
    case 'DISPUTED':
      return `Your payment of ${currency} ${amount} has been disputed`;
    default:
      return `Your payment of ${currency} ${amount} status has been updated to ${status}`;
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const signature = request.headers.get('x-intasend-signature');

    // Verify webhook signature
    if (!verifySignature(data, signature)) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Update payment record
    const paymentRef = doc(db, 'payments', data.paymentId);
    await updateDoc(paymentRef, {
      status: data.status,
      transactionId: data.transactionId,
      metadata: data.metadata,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 