'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  category: string;
  price: number;
  status: 'active' | 'draft';
  students: number;
  createdAt: string;
}

export default function ManageCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, 'courses');
        const coursesSnapshot = await getDocs(coursesCollection);
        const coursesList = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Course));
        setCourses(coursesList);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      // Delete the course from Firestore
      await deleteDoc(doc(db, 'courses', courseId));
      
      // Update the local state
      setCourses(courses.filter(course => course.id !== courseId));
      
      // Show success message (you might want to add a toast notification here)
      alert('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

  return (
    <div className="flex-1">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-sm text-gray-500">
              View and manage your course catalog
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/courses/create')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Course
          </button>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="border-b p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-gray-50 text-gray-700 bg-white"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-gray-50">
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Course
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Instructor
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Category
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Price
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Students
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Loading courses...
                    </td>
                  </tr>
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No courses found. Click "Add Course" to create one.
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr
                      key={course.id}
                      className="border-b transition-colors hover:bg-gray-50"
                    >
                      <td className="p-4 align-middle text-gray-900 [&:has([role=checkbox])]:pr-0">
                        <div className="flex flex-col">
                          <span className="font-medium">{course.name}</span>
                          <span className="text-xs text-gray-500">{course.code}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-gray-900 [&:has([role=checkbox])]:pr-0">
                        {course.instructor}
                      </td>
                      <td className="p-4 align-middle text-gray-900 [&:has([role=checkbox])]:pr-0">
                        {course.category}
                      </td>
                      <td className="p-4 align-middle text-gray-900 [&:has([role=checkbox])]:pr-0">
                        ${course.price.toFixed(2)}
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                            ${course.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-gray-900 [&:has([role=checkbox])]:pr-0">
                        {course.students}
                      </td>
                      <td className="p-4 text-right align-middle [&:has([role=checkbox])]:pr-0">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/courses/edit/${course.id}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
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