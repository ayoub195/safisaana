'use client';

import { Book, DollarSign, ShoppingCart, Package, Settings } from 'lucide-react';
import { StatsCard } from '../components/dashboard/stats-card';
import { QuickAction } from '../components/dashboard/quick-action';

export default function Dashboard() {
  // Sample static data (in a real app, this would come from an API)
  const statsCards = [
    {
      title: 'Total Revenue',
      value: '$0.00',
      icon: DollarSign,
      color: 'blue',
      percentageChange: '+8.3%',
      to: '/dashboard/orders'
    },
    {
      title: 'Active Courses',
      value: '1',
      icon: Book,
      color: 'green',
      percentageChange: '+5%',
      to: '/dashboard/courses'
    },
    {
      title: 'Active Products',
      value: '2',
      icon: Package,
      color: 'orange',
      percentageChange: '+12%',
      to: '/dashboard/products'
    },
    {
      title: 'Recent Orders',
      value: '0',
      icon: ShoppingCart,
      color: 'pink',
      percentageChange: '+12%',
      to: '/dashboard/orders'
    }
  ] as const;

  const quickActions = [
    {
      title: "Add Course",
      description: "Create a new course with lessons and content",
      icon: Book,
      to: "/dashboard/courses/create"
    },
    {
      title: "Add Product",
      description: "Create a new product for your store",
      icon: Package,
      to: "/dashboard/products/create"
    },
    {
      title: "View Orders",
      description: "Manage and track all orders",
      icon: ShoppingCart,
      to: "/dashboard/orders"
    },
    {
      title: "Settings",
      description: "Update your platform settings",
      icon: Settings,
      to: "/dashboard/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Safisaana Ltd
        </h1>
        <p className="text-gray-600">
          You have admin access to manage all products and courses.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
} 