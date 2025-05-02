'use client';

import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-purple-600 p-4 fixed w-full top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Safisaana Ltd</h1>
          <div className="flex gap-6">
            <Link href="/" className="text-white hover:text-gray-200">Home</Link>
            <Link href="/dashboard" className="text-white hover:text-gray-200">Dashboard</Link>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 h-full w-64 bg-white shadow-md">
        <nav className="p-4">
          <Link 
            href="/dashboard"
            className="block text-lg font-semibold mb-4 text-gray-900 hover:text-purple-600 transition-colors"
          >
            Dashboard
          </Link>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard/products" 
                className="flex items-center p-2 text-gray-900 hover:bg-purple-50 rounded-md"
              >
                Products
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/settings" 
                className="flex items-center p-2 text-gray-900 hover:bg-purple-50 rounded-md"
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-16">
        {children}
      </main>
    </div>
  );
} 