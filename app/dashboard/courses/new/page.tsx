'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct } from '@/app/services/firebase';
import { toast } from 'react-hot-toast';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  isPreview: boolean;
  videoUrl?: string;
}

interface CourseForm {
  title: string;
  description: string;
  price: number;
  lessons: Lesson[];
}

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<CourseForm>({
    title: '',
    description: '',
    price: 0,
    lessons: []
  });

  const [newLesson, setNewLesson] = useState({
    title: '',
    duration: 0,
    isPreview: false,
    videoUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate total duration
      const totalDuration = course.lessons.reduce((acc, lesson) => acc + lesson.duration, 0) / 60; // Convert to hours

      await addProduct({
        ...course,
        productType: 'course',
        duration: totalDuration
      });

      toast.success('Course created successfully');
      router.push('/dashboard/courses');
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const addLesson = () => {
    if (!newLesson.title || newLesson.duration <= 0) {
      toast.error('Please fill in all lesson fields');
      return;
    }

    setCourse(prev => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          id: Date.now().toString(),
          ...newLesson
        }
      ]
    }));

    setNewLesson({
      title: '',
      duration: 0,
      isPreview: false,
      videoUrl: ''
    });
  };

  const removeLesson = (id: string) => {
    setCourse(prev => ({
      ...prev,
      lessons: prev.lessons.filter(lesson => lesson.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Course</h1>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              {/* Course Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Details</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={course.title}
                      onChange={(e) => setCourse({ ...course, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={course.description}
                      onChange={(e) => setCourse({ ...course, description: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={course.price}
                      onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lessons</h2>
                
                {/* Add New Lesson */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Lesson</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lessonTitle" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        id="lessonTitle"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="lessonDuration" className="block text-sm font-medium text-gray-700">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        id="lessonDuration"
                        value={newLesson.duration}
                        onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) })}
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="lessonVideo" className="block text-sm font-medium text-gray-700">
                        Video URL
                      </label>
                      <input
                        type="url"
                        id="lessonVideo"
                        value={newLesson.videoUrl}
                        onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        id="isPreview"
                        checked={newLesson.isPreview}
                        onChange={(e) => setNewLesson({ ...newLesson, isPreview: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="isPreview" className="ml-2 block text-sm text-gray-700">
                        Preview Lesson
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addLesson}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Add Lesson
                  </button>
                </div>

                {/* Lesson List */}
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 bg-white border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {index + 1}. {lesson.title}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {lesson.duration} minutes • {lesson.isPreview ? 'Preview Available' : 'Full Course'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLesson(lesson.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || course.lessons.length === 0}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Course...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 