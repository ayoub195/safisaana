'use client';

import { Lesson } from '../types/lesson';
import { LockClosedIcon, PlayIcon } from '@heroicons/react/24/solid';

interface LessonCardProps {
  lesson: Lesson;
  isPaid?: boolean;
  onClick?: () => void;
}

export default function LessonCard({ lesson, isPaid = false, onClick }: LessonCardProps) {
  const isAccessible = lesson.isPreview || isPaid;

  return (
    <div 
      onClick={isAccessible ? onClick : undefined}
      className={`relative rounded-lg border p-4 mb-4 ${
        isAccessible ? 'cursor-pointer hover:border-blue-500 transition-colors' : 'opacity-75'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{lesson.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
          <div className="flex items-center mt-2 space-x-4">
            <span className="text-sm text-gray-500">
              Duration: {lesson.duration}
            </span>
            {lesson.isPreview && (
              <span className="text-sm text-green-600 font-medium">
                Preview Available
              </span>
            )}
          </div>
        </div>
        <div className="ml-4">
          {isAccessible ? (
            <div className="rounded-full bg-blue-100 p-2">
              <PlayIcon className="h-6 w-6 text-blue-600" />
            </div>
          ) : (
            <div className="rounded-full bg-gray-100 p-2">
              <LockClosedIcon className="h-6 w-6 text-gray-600" />
            </div>
          )}
        </div>
      </div>
      {!isAccessible && (
        <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <LockClosedIcon className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-600">
              Purchase the course to access this lesson
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 