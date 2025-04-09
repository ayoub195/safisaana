'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  X,
  ChevronDown,
  GripVertical,
  ChevronUp,
  Image as ImageIcon,
  Video,
  Link as LinkIcon
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

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  isOpen: boolean;
}

interface SortableLessonProps {
  lesson: Lesson;
  onUpdate: (id: string, updates: Partial<Lesson>) => void;
  onDelete: (id: string) => void;
}

// Simple lesson component for the drag overlay
const LessonItem = ({ lesson }: { lesson: Lesson }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-blue-500">
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <GripVertical size={20} className="text-blue-500" />
        </div>
        <span className="font-medium truncate">{lesson.title || 'Untitled Lesson'}</span>
      </div>
    </div>
  );
};

const SortableLesson = ({ lesson, onUpdate, onDelete }: SortableLessonProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: lesson.id,
    data: lesson
  });

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
            value={lesson.title}
            onChange={(e) => onUpdate(lesson.id, { title: e.target.value })}
            placeholder="Lesson Title"
            className="flex-1 text-sm bg-transparent border-none focus:outline-none placeholder-gray-400 text-gray-900"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onUpdate(lesson.id, { isOpen: !lesson.isOpen })}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-500"
          >
            {lesson.isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button
            type="button"
            onClick={() => onDelete(lesson.id)}
            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {lesson.isOpen && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Video URL
            </label>
            <div className="flex items-center gap-2">
              <Video size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="url"
                value={lesson.videoUrl}
                onChange={(e) => onUpdate(lesson.id, { videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
                className="flex-1 text-sm p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Duration (e.g., "15:00" or "1:30:00")
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={lesson.duration}
                onChange={(e) => onUpdate(lesson.id, { duration: e.target.value })}
                placeholder="00:00"
                className="w-32 text-sm p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={lesson.description}
              onChange={(e) => onUpdate(lesson.id, { description: e.target.value })}
              placeholder="Detailed description of the lesson"
              rows={3}
              className="w-full text-sm p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default function CreateCoursePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState(['Development', 'Business', 'Design', 'Marketing']);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragData, setActiveDragData] = useState<Lesson | null>(null);

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
    
    const draggedLesson = lessons.find(lesson => lesson.id === active.id);
    if (draggedLesson) {
      setActiveDragData(draggedLesson);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setLessons((items) => {
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

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      isOpen: true
    };
    setLessons([...lessons, newLesson]);
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id ? { ...lesson, ...updates } : lesson
    ));
  };

  const deleteLesson = (id: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  const deleteCategory = (categoryToDelete: string) => {
    setCategories(categories.filter(cat => cat !== categoryToDelete));
    if (selectedCategory === categoryToDelete) {
      setSelectedCategory('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseData = {
      name,
      description,
      price: parseFloat(price),
      thumbnailUrl,
      category: selectedCategory,
      lessons: lessons.map(({ id, ...rest }) => rest)
    };

    try {
      // TODO: Send data to your API
      console.log(courseData);
      
      // Navigate back to courses management
      router.push('/dashboard/courses/manage');
    } catch (error) {
      console.error('Error creating course:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-1">Add a new course to your platform</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name
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
                Thumbnail URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="https://example.com/thumbnail.jpg"
                  required
                />
              </div>
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
                  <span className="text-gray-900">{selectedCategory || 'Select a category'}</span>
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
                            key={category}
                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <span
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsDropdownOpen(false);
                              }}
                              className="flex-grow text-gray-900"
                            >
                              {category}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCategory(category);
                              }}
                              className="ml-2 text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
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
          </div>

          {/* Lessons Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Course Lessons</h2>
              <button
                type="button"
                onClick={addLesson}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg"
              >
                <Plus size={18} />
                Add Lesson
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
                  items={lessons.map(lesson => lesson.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <SortableLesson
                        key={lesson.id}
                        lesson={lesson}
                        onUpdate={updateLesson}
                        onDelete={deleteLesson}
                      />
                    ))}
                  </div>
                </SortableContext>
                
                <DragOverlay adjustScale={true}>
                  {activeDragData ? (
                    <div className="opacity-80 transform scale-105 shadow-xl">
                      <LessonItem lesson={activeDragData} />
                    </div>
                  ) : null}
                </DragOverlay>
                
                {lessons.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-gray-200 border-dashed rounded-lg">
                    <p>No lessons added yet. Click "Add Lesson" to get started.</p>
                  </div>
                )}
              </DndContext>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/courses/manage')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 