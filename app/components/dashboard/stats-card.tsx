'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'pink';
  percentageChange?: string;
  to: string;
}

const colorStyles = {
  blue: 'bg-blue-500 hover:bg-blue-600',
  green: 'bg-emerald-500 hover:bg-emerald-600',
  orange: 'bg-orange-500 hover:bg-orange-600',
  pink: 'bg-pink-500 hover:bg-pink-600'
};

export const StatsCard = ({ title, value, icon: Icon, color, percentageChange, to }: StatsCardProps) => (
  <Link href={to} className="block">
    <div className={`${colorStyles[color]} rounded-xl p-6 text-white transition-all duration-200 hover:scale-[1.02] transform`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/90">{title}</h3>
        <div className="p-2 bg-white/10 rounded-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold">{value}</p>
        {percentageChange && (
          <p className="text-sm text-white/80">
            {percentageChange} from last month
          </p>
        )}
      </div>
    </div>
  </Link>
); 