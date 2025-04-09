'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  X,
  Download,
  Trash2,
  ChevronDown,
  GripVertical,
  ChevronUp,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface ProductImage {
  id: string;
  url: string;
  title: string;
  description: string;
  isOpen: boolean;
}

interface SortableImageProps {
  image: ProductImage;
  onUpdate: (id: string, updates: Partial<ProductImage>) => void;
  onDelete: (id: string) => void;
}

// Simple image component for the drag overlay
const ImageItem = ({ image }: { image: ProductImage }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-blue-500">
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <GripVertical size={20} className="text-blue-500" />
        </div>
        <span className="font-medium truncate">{image.title || 'Untitled Image'}</span>
      </div>
      {image.url && (
        <div className="mt-2">
          <img
            src={image.url}
            alt={image.title}
            className="h-20 w-auto object-cover rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
            }}
          />
        </div>
      )}
    </div>
  );
};

const SortableImage = ({ image, onUpdate, onDelete }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: image.id,
    data: image
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg overflow-hidden ${isDragging ? 'cursor-grabbing shadow-lg' : ''} hover:bg-gray-50`}
    >
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3 flex-1">
          <button
            {...attributes}
            {...listeners}
            className={`cursor-grab hover:text-blue-600 touch-none ${isDragging ? 'cursor-grabbing' : ''}`}
            type="button"
          >
            <GripVertical size={18} className="text-gray-400" />
          </button>
          <input
            type="text"
            value={image.title}
            onChange={(e) => onUpdate(image.id, { title: e.target.value })}
            placeholder="Image Title"
            className="flex-1 text-sm bg-transparent border-none focus:outline-none placeholder-gray-400 text-gray-900"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onUpdate(image.id, { isOpen: !image.isOpen })}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-500"
          >
            {image.isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button
            type="button"
            onClick={() => onDelete(image.id)}
            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {image.isOpen && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <div className="flex items-center gap-2">
              <ImageIcon size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="url"
                value={image.url}
                onChange={(e) => onUpdate(image.id, { url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="flex-1 text-sm p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
              />
              {image.url && (
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                  title="Preview image"
                >
                  <Eye size={18} />
                </button>
              )}
            </div>
          </div>
          
          {image.url && (
            <div className="mt-2">
              <img
                src={image.url}
                alt={image.title}
                className="max-h-32 rounded object-cover cursor-pointer"
                onClick={() => setIsPreviewOpen(true)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                }}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Description
            </label>
            <textarea
              value={image.description}
              onChange={(e) => onUpdate(image.id, { description: e.target.value })}
              placeholder="Detailed description of the image"
              rows={3}
              className="w-full text-sm p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
            />
          </div>
        </div>
      )}

      {isPreviewOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            className="max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{image.title || 'Image Preview'}</h3>
              <button 
                onClick={() => setIsPreviewOpen(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={image.url}
                alt={image.title}
                className="max-w-full max-h-[70vh] object-contain mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                }}
              />
              {image.description && (
                <p className="mt-4 text-gray-600 text-sm">{image.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface CreateProductPageProps {
  isEditing?: boolean;
  initialData?: any;
  onSubmit?: (data: any) => Promise<void>;
}

export default function CreateProductPage({ isEditing, initialData, onSubmit }: CreateProductPageProps = {}) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [type, setType] = useState(initialData?.type || 'digital');
  const [stock, setStock] = useState(initialData?.stock?.toString() || '');
  const [downloadUrl, setDownloadUrl] = useState(initialData?.downloadUrl || '');
  const [images, setImages] = useState<ProductImage[]>(
    initialData?.images?.map((img: any, index: number) => ({
      id: index.toString(),
      ...img,
      isOpen: false
    })) || []
  );
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || '');
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragData, setActiveDragData] = useState<ProductImage | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Find the image data for the drag overlay
    const draggedImage = images.find(img => img.id === active.id);
    if (draggedImage) {
      setActiveDragData(draggedImage);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
    setActiveDragData(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const addImage = () => {
    const newImage: ProductImage = {
      id: Date.now().toString(),
      url: '',
      title: '',
      description: '',
      isOpen: true
    };
    setImages([...images, newImage]);
  };

  const updateImage = (id: string, updates: Partial<ProductImage>) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, ...updates } : img
    ));
  };

  const deleteImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const addCategory = async () => {
    if (newCategory.trim()) {
      try {
        // Add to Firestore
        const docRef = await addDoc(collection(db, 'categories'), {
          name: newCategory.trim(),
          createdAt: new Date().toISOString()
        });
        
        // Update local state
        setCategories([...categories, { id: docRef.id, name: newCategory.trim() }]);
        setNewCategory('');
        setIsAddingCategory(false);
      } catch (error) {
        console.error('Error adding category:', error);
        alert('Failed to add category. Please try again.');
      }
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'categories', categoryId));
      
      // Update local state
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
      
      // Clear selection if deleted category was selected
      const deletedCategory = categories.find(cat => cat.id === categoryId);
      if (deletedCategory && selectedCategory === deletedCategory.name) {
        setSelectedCategory('');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name,
        description,
        price: parseFloat(price),
        type,
        category: selectedCategory,
        stock: type === 'physical' ? parseInt(stock) : null,
        downloadUrl: type === 'digital' ? downloadUrl : null,
        images: images.map(({ id, isOpen, ...rest }) => rest)
      };

      if (isEditing && onSubmit) {
        await onSubmit(productData);
      } else {
        // Add the product to Firestore
        const docRef = await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log('Product created with ID:', docRef.id);
        router.push('/dashboard/products/manage');
      }
    } catch (error) {
      console.error('Error with product:', error);
      alert(isEditing ? 'Error updating product' : 'Error creating product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update your product information' : 'Add a new product to your store'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between text-gray-900"
                >
                  <span>{selectedCategory || 'Select a category'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {isAddingCategory ? (
                      <div className="p-3 border-b">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="Enter new category"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={addCategory}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingCategory(false);
                              setNewCategory('');
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-auto">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <span
                              onClick={() => {
                                setSelectedCategory(category.name);
                                setIsDropdownOpen(false);
                              }}
                              className="flex-grow text-gray-900"
                            >
                              {category.name}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCategory(category.id);
                              }}
                              className="ml-2 text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <div
                          className="flex items-center px-4 py-2 text-blue-600 hover:bg-gray-50 cursor-pointer border-t"
                          onClick={() => setIsAddingCategory(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          <span>Add New Category</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer text-gray-900"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="digital" className="text-gray-900 bg-white">Digital</option>
                  <option value="physical" className="text-gray-900 bg-white">Physical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>
            </div>

            {type === 'physical' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Download URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Download className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="https://example.com/download/product.pdf"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
              <button
                type="button"
                onClick={addImage}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg"
              >
                <Plus size={18} />
                Add Image
              </button>
            </div>

            <div className="p-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map(img => img.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {images.map((image) => (
                      <SortableImage
                        key={image.id}
                        image={image}
                        onUpdate={updateImage}
                        onDelete={deleteImage}
                      />
                    ))}
                  </div>
                </SortableContext>
                
                <DragOverlay adjustScale={true}>
                  {activeDragData ? (
                    <div className="opacity-80 transform scale-105 shadow-xl">
                      <ImageItem image={activeDragData} />
                    </div>
                  ) : null}
                </DragOverlay>
                
                {images.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-gray-200 border-dashed rounded-lg">
                    <p>No images added yet. Click "Add Image" to get started.</p>
                  </div>
                )}
              </DndContext>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/products/manage')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 