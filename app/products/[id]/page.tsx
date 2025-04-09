'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Script from 'next/script';

declare global {
  interface Window {
    IntaSend: any;
  }
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  images: Array<{
    url: string;
    title: string;
    description: string;
  }>;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [processing, setProcessing] = useState(false);
  const { id } = use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'products', id));
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() } as Product);
        } else {
          router.push('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handlePayment = async () => {
    if (!product) return;

    try {
      setProcessing(true);
      
      // Initialize payment through our API
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: product.price,
          currency: 'USD',
          customerId: 'guest_' + Math.random().toString(36).substr(2, 9),
          productId: product.id
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.details || data.error || 'Payment initialization failed');
      }

      // Validate required config
      if (!data.config?.public_key) {
        throw new Error('Invalid payment configuration received from server');
      }

      // Initialize IntaSend Checkout
      const checkout = new window.IntaSend({
        publicKey: data.config.public_key,
        amount: data.config.amount,
        currency: data.config.currency,
        email: data.config.email,
        firstName: data.config.first_name,
        lastName: data.config.last_name,
        country: data.config.country,
        paymentMethod: data.config.payment_method,
        apiRef: data.config.api_ref,
        callbackUrl: data.config.callback_url,
        redirectUrl: data.config.redirect_url,
        dev: process.env.NODE_ENV === 'development'
      });

      // Setup event handlers
      checkout
        .on('COMPLETE', async (results: any) => {
          console.log('Payment completed:', results);
          router.push(`/payment/success?id=${data.paymentId}`);
        })
        .on('FAILED', (error: any) => {
          console.error('Payment failed:', error);
          alert('Payment failed: ' + (error.message || 'Please try again.'));
        })
        .on('CANCELED', () => {
          console.log('Payment canceled by user');
          alert('Payment was canceled by user.');
        });

      // Open checkout
      await checkout.show();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + (error.message || 'Please try again.'));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://unpkg.com/intasend-inlinejs-sdk@3.0.4/build/intasend-inline.js"
        strategy="beforeInteractive"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Products
          </button>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[selectedImage].url}
                      alt={product.images[selectedImage].title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                          selectedImage === index ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  {product.category && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 mt-2">
                      {product.category}
                    </span>
                  )}
                </div>

                <div className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </div>

                <div className="prose prose-sm text-gray-500">
                  <p>{product.description}</p>
                </div>

                {product.images && product.images[selectedImage]?.description && (
                  <div className="prose prose-sm text-gray-500">
                    <h4 className="text-sm font-medium text-gray-900">Image Description</h4>
                    <p>{product.images[selectedImage].description}</p>
                  </div>
                )}

                <div className="pt-6">
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium ${
                      processing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {processing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        Buy Now
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Secure payment via IntaSend - Cards & MPESA accepted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 