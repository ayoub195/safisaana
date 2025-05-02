'use client';

import { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '@/app/services/firebase';
import { toast } from 'react-hot-toast';

interface Lesson {
  title: string;
  videoUrl: string;
  isPreview: boolean;
}

interface Product {
  id?: string;
  title: string;
  description: string;
  productType: string;
  price: number;
  thumbnailUrl: string;
  downloadUrl?: string;
  duration?: number;
  pageCount?: number;
  lessons?: Lesson[];
  featured?: boolean;
}

interface ProductFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Product | null;
}

export default function ProductForm({ onClose, onSuccess, initialData }: ProductFormProps) {
  const [productType, setProductType] = useState(initialData?.productType || '');
  const [lessons, setLessons] = useState<Lesson[]>(
    initialData?.lessons || [{ title: '', videoUrl: '', isPreview: false }]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    thumbnailUrl: initialData?.thumbnailUrl || '',
    price: initialData?.price || 0,
    downloadUrl: initialData?.downloadUrl || '',
    duration: initialData?.duration || 0,
    pageCount: initialData?.pageCount || 0,
    featured: initialData?.featured || false,
  });

  useEffect(() => {
    if (initialData) {
      setProductType(initialData.productType);
      setLessons(initialData.lessons || [{ title: '', videoUrl: '', isPreview: false }]);
      setFormData({
        title: initialData.title,
        description: initialData.description,
        thumbnailUrl: initialData.thumbnailUrl,
        price: initialData.price,
        downloadUrl: initialData.downloadUrl || '',
        duration: initialData.duration || 0,
        pageCount: initialData.pageCount || 0,
        featured: initialData.featured || false,
      });
      
      // Show the appropriate fields
      const courseFields = document.getElementById('courseFields');
      const ebookFields = document.getElementById('ebookFields');
      
      if (initialData.productType === 'course') {
        courseFields?.classList.remove('hidden');
        ebookFields?.classList.add('hidden');
      } else if (initialData.productType === 'ebook') {
        ebookFields?.classList.remove('hidden');
        courseFields?.classList.add('hidden');
      }
    }
  }, [initialData]);

  const handleProductTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductType(e.target.value);
    const courseFields = document.getElementById('courseFields');
    const ebookFields = document.getElementById('ebookFields');
    
    if (e.target.value === 'course') {
      courseFields?.classList.remove('hidden');
      ebookFields?.classList.add('hidden');
    } else if (e.target.value === 'ebook') {
      ebookFields?.classList.remove('hidden');
      courseFields?.classList.add('hidden');
    } else {
      courseFields?.classList.add('hidden');
      ebookFields?.classList.add('hidden');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', videoUrl: '', isPreview: false }]);
  };

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const updateLesson = (index: number, field: keyof Lesson, value: string | boolean) => {
    const updatedLessons = lessons.map((lesson, i) => {
      if (i === index) {
        return { ...lesson, [field]: value };
      }
      return lesson;
    });
    setLessons(updatedLessons);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        productType,
        ...(productType === 'course' && {
          lessons,
        }),
      };

      if (initialData?.id) {
        await updateProduct(initialData.id, productData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(productData);
        toast.success('Product created successfully!');
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(initialData ? 'Failed to update product' : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="productType" className="block text-sm font-medium text-gray-900 mb-1">
          Product Type
        </label>
        <select
          id="productType"
          name="productType"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
          onChange={handleProductTypeChange}
          value={productType}
          required
          disabled={!!initialData}
        >
          <option value="">Select product type</option>
          <option value="course">Course</option>
          <option value="ebook">E-Book</option>
        </select>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
          placeholder="Enter title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
          placeholder="Enter description"
          required
        />
      </div>

      <div>
        <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-900 mb-1">
          Thumbnail URL
        </label>
        <input
          type="url"
          id="thumbnailUrl"
          name="thumbnailUrl"
          value={formData.thumbnailUrl}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
          placeholder="Enter thumbnail URL"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-1">
          Price (USD)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
          placeholder="Enter price"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleInputChange}
          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
          Feature this product on homepage
        </label>
      </div>

      {/* E-Book specific field */}
      <div id="ebookFields" className="hidden space-y-4">
        <div>
          <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700">
            Download URL
          </label>
          <input
            type="text"
            id="downloadUrl"
            name="downloadUrl"
            value={formData.downloadUrl}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="pageCount" className="block text-sm font-medium text-gray-700">
            Page Count
          </label>
          <input
            type="number"
            id="pageCount"
            name="pageCount"
            value={formData.pageCount}
            onChange={handleInputChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Course specific fields */}
      <div id="courseFields" className="hidden">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-900 mb-1">
            Duration (in hours)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            placeholder="Enter course duration"
            min="0"
            step="0.5"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Lessons
          </label>
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div key={index} className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Lesson title"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    value={lesson.title}
                    onChange={(e) => updateLesson(index, 'title', e.target.value)}
                    required={productType === 'course'}
                  />
                  <input
                    type="url"
                    placeholder="Video URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    value={lesson.videoUrl}
                    onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                    required={productType === 'course'}
                  />
                  {lessons.length > 1 && (
                    <button
                      type="button"
                      className="bg-purple-100 text-purple-600 px-3 py-2 rounded-md hover:bg-purple-200"
                      onClick={() => removeLesson(index)}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`isPreview-${index}`}
                    checked={lesson.isPreview}
                    onChange={(e) => updateLesson(index, 'isPreview', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor={`isPreview-${index}`} className="ml-2 block text-sm text-gray-700">
                    Set as preview lesson (free to watch)
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 text-purple-600 hover:text-purple-700 flex items-center"
            onClick={addLesson}
          >
            <span className="material-icons mr-1">add</span>
            Add Lesson
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 