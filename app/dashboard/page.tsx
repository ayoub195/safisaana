'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/dashboard');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Sample data - replace with actual data from your backend
  const stats = {
    courses: {
      total: 12,
      active: 8,
      draft: 4
    },
    ebooks: {
      total: 15,
      published: 10,
      draft: 5
    },
    users: {
      total: 150,
      students: 120,
      instructors: 30
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Out
          </button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Courses Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
              <span className="material-icons text-purple-600 text-2xl">school</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Courses</span>
                <span className="text-2xl font-bold text-gray-900">{stats.courses.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active</span>
                <span className="text-green-600 font-semibold">{stats.courses.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Draft</span>
                <span className="text-orange-600 font-semibold">{stats.courses.draft}</span>
              </div>
            </div>
          </div>

          {/* E-Books Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">E-Books</h3>
              <span className="material-icons text-purple-600 text-2xl">menu_book</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total E-Books</span>
                <span className="text-2xl font-bold text-gray-900">{stats.ebooks.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Published</span>
                <span className="text-green-600 font-semibold">{stats.ebooks.published}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Draft</span>
                <span className="text-orange-600 font-semibold">{stats.ebooks.draft}</span>
              </div>
            </div>
          </div>

          {/* Users Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Users</h3>
              <span className="material-icons text-purple-600 text-2xl">group</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Users</span>
                <span className="text-2xl font-bold text-gray-900">{stats.users.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Students</span>
                <span className="text-blue-600 font-semibold">{stats.users.students}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Instructors</span>
                <span className="text-indigo-600 font-semibold">{stats.users.instructors}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="material-icons text-purple-600">add_circle</span>
                <div>
                  <p className="text-gray-900 font-medium">New Course Added</p>
                  <p className="text-gray-600 text-sm">Introduction to Web Development</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="material-icons text-purple-600">upload_file</span>
                <div>
                  <p className="text-gray-900 font-medium">New E-Book Published</p>
                  <p className="text-gray-600 text-sm">Advanced JavaScript Techniques</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="material-icons text-purple-600">person_add</span>
                <div>
                  <p className="text-gray-900 font-medium">New Instructor Joined</p>
                  <p className="text-gray-600 text-sm">Sarah Johnson</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 