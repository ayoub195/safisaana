'use client';

import { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '@/app/services/firebase';
import ProductForm from '../components/ProductForm';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  title: string;
  description: string;
  productType: string;
  price: number;
  thumbnailUrl: string;
  createdAt: any;
  downloadUrl?: string;
  duration?: number;
  featured?: boolean;
  lessons?: Array<{
    title: string;
    videoUrl: string;
    isPreview: boolean;
  }>;
}

export default function ProductsPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
            onClick={() => setShowProductForm(true)}
          >
            <span className="material-icons text-xl">add</span>
            Add Product
          </button>
        </div>

        {/* Product Form */}
        {showProductForm && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <ProductForm 
              onClose={handleCloseForm}
              onSuccess={fetchProducts}
              initialData={editingProduct}
            />
          </div>
        )}

        {/* Products List */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No products added yet.</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={product.thumbnailUrl}
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-sm font-medium capitalize" 
                          style={{
                            backgroundColor: product.productType === 'course' ? '#EDE9FE' : '#FEF3C7',
                            color: product.productType === 'course' ? '#5B21B6' : '#92400E'
                          }}
                        >
                          {product.productType}
                        </span>
                        {product.featured && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                          title="Edit product"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                          title="Delete product"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.productType === 'course' && (
                        <span className="text-sm text-gray-600">
                          {product.lessons?.length} lessons • {product.duration} hours
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        Created {new Date(product.createdAt.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 