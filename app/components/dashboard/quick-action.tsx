'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
}

export const QuickAction = ({ title, description, icon: Icon, to }: QuickActionProps) => (
  <Link
    href={to}
    className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </Link>
); 