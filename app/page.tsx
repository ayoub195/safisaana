'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { getFeaturedProducts } from '@/app/services/firebase';

interface Product {
  id: string;
  title: string;
  description: string;
  productType: string;
  price: number;
  thumbnailUrl: string;
  featured: boolean;
}

export default function Home() {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products as Product[]);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-blue-600">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-white mb-4">
            {user ? `Good evening, ${user.email?.split('@')[0]}.` : 'Welcome to Safisaana Ltd'}
          </p>
          <h2 className="text-5xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">Safisaana Ltd</span>
          </h2>
          <p className="text-white text-xl mb-12">
            Discover our wide range of quality products and courses designed to help you succeed
          </p>
          
          <div className="flex gap-6 justify-center">
            <Link
              href="/courses"
              className="bg-white text-blue-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              href="/ebooks"
              className="bg-white text-blue-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Browse E-Books
            </Link>
          </div>
        </div>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8">Featured Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={product.thumbnailUrl}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold">{product.title}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {product.productType}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
                      <Link
                        href={`/${product.productType}s/${product.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
