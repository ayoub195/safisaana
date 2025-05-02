'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/app/services/firebase';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

interface Ebook {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  pageCount: number;
  format: string;
}

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const products = await getProducts();
        const ebooksData = products.filter(
          (product: any) => product.productType === 'ebook'
        );
        setEbooks(ebooksData as Ebook[]);
      } catch (error) {
        console.error('Error fetching ebooks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-t-lg"></div>
              <div className="bg-white p-4 rounded-b-lg space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available E-Books</h1>
        
        {ebooks.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg text-gray-600">No e-books available yet.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map((ebook) => (
              <div key={ebook.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img
                    src={ebook.thumbnailUrl}
                    alt={ebook.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-purple-600 font-medium">${ebook.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{ebook.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{ebook.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <BookOpenIcon className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-500 text-sm">{ebook.pageCount} pages</span>
                    </div>
                    <span className="text-gray-500 text-sm uppercase">{ebook.format}</span>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => router.push(`/checkout/ebook/${ebook.id}`)}
                      className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <BookOpenIcon className="h-5 w-5 mr-2" />
                      Purchase Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 