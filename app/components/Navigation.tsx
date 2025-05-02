'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname === path ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-purple-600">
                Safisaana
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/courses"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/courses' ? 'border-purple-500' : 'border-transparent'
                } ${isActive('/courses')}`}
              >
                Courses
              </Link>
              <Link
                href="/ebooks"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/ebooks' ? 'border-purple-500' : 'border-transparent'
                } ${isActive('/ebooks')}`}
              >
                E-Books
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard')}`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 