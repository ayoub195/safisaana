'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/app/services/firebase';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { PlayIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  duration: number;
  lessons: Array<{
    title: string;
    isPreview: boolean;
  }>;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const products = await getProducts();
        const coursesData = products.filter(
          (product: any) => product.productType === 'course'
        );
        setCourses(coursesData as Course[]);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Courses</h1>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg text-gray-600">No courses available yet.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-purple-600 font-medium">${course.price.toFixed(2)}</span>
                    <span className="text-gray-500 text-sm">{course.duration} hours</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">{course.lessons.length} lessons</span>
                      {course.lessons.some(lesson => lesson.isPreview) && (
                        <span className="text-green-600 font-medium">(Preview available)</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <PlayIcon className="h-5 w-5 mr-2" />
                      {user ? 'View Course' : 'Enroll Now'}
                    </Link>
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