import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { amount, currency, customerId, productId } = data;

    // Validate required environment variables
    if (!process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY) {
      throw new Error('NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY is not configured');
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('NEXT_PUBLIC_APP_URL is not configured');
    }

    // Create payment record
    const paymentRef = await addDoc(collection(db, 'payments'), {
      amount,
      currency,
      customerId,
      productId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });

    // Initialize IntaSend checkout
    const intaSendConfig = {
      public_key: process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY,
      amount: amount.toString(), // Convert to string as IntaSend expects string
      currency: currency,
      email: 'customer@example.com',
      first_name: 'Customer',
      last_name: '',
      country: 'KE',
      payment_method: 'M-PESA',
      api_ref: paymentRef.id,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
    };

    // Log the config for debugging (remove in production)
    console.log('IntaSend Config:', {
      ...intaSendConfig,
      public_key: '***' // Hide the key in logs
    });

    return NextResponse.json({
      success: true,
      paymentId: paymentRef.id,
      config: intaSendConfig
    });
  } catch (error: any) {
    console.error('Payment initialization error:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Payment initialization failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 