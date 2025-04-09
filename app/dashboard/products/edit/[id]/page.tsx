'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import CreateProductPage from '../../create/page';
import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  category: string;
  stock?: number;
  downloadUrl?: string;
  images: Array<{
    url: string;
    title: string;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'products', id));
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() } as Product);
        } else {
          console.error('Product not found');
          router.push('/dashboard/products/manage');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleUpdate = async (updatedData: Partial<Product>) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      router.push('/dashboard/products/manage');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <CreateProductPage 
      isEditing={true}
      initialData={product}
      onSubmit={handleUpdate}
    />
  );
} 