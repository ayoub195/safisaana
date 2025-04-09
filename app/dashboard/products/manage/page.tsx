'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'active' | 'draft';
  createdAt: string;
  images: Array<{
    url: string;
    title: string;
    description: string;
  }>;
}

export default function ManageProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(product => product.id !== productId));
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
            <p className="text-gray-600 mt-1">View and manage your product catalog</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/products/create')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-gray-50">
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Product
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Category
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Price
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Created
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No products found. Click "Add Product" to create one.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b transition-colors hover:bg-gray-50"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg border bg-gray-50/50 flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0].url} 
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=No+Image';
                                }}
                              />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{product.name}</span>
                            {product.category && (
                              <span className="text-xs text-gray-500">{product.category}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {product.category ? (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {product.category}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">No category</span>
                        )}
                      </td>
                      <td className="p-4 align-middle text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="p-4 align-middle">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                            ${product.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-gray-900">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 