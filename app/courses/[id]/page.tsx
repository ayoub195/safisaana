'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useAuth } from '@/app/context/AuthContext';
import { PlayIcon, LockClosedIcon, ClockIcon } from '@heroicons/react/24/solid';
import { useParams } from 'next/navigation';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  isPreview: boolean;
  videoUrl?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  lessons: Lesson[];
}

const BUNNY_PLAYER_SCRIPT = "https://cdn.jsdelivr.net/npm/[email protected]/dist/shaka-player.compiled.min.js";

export default function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseDoc = await getDoc(doc(db, 'products', id as string));
        if (courseDoc.exists()) {
          const courseData = {
            id: courseDoc.id,
            ...courseDoc.data()
          } as Course;
          setCourse(courseData);
          // Set first preview lesson or first lesson as selected if user has access
          const firstAvailableLesson = courseData.lessons.find(
            lesson => lesson.isPreview || user
          );
          setSelectedLesson(firstAvailableLesson || null);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-[600px] bg-gray-200 rounded-lg"></div>
            <div className="flex gap-8">
              <div className="w-2/3">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="w-1/3 space-y-3">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-5 w-5 bg-gray-200 rounded"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
          <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const handleLessonSelect = (lesson: Lesson) => {
    if (lesson.isPreview || user) {
      setSelectedLesson(lesson);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script src={BUNNY_PLAYER_SCRIPT} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Video Player Section */}
            <div className="lg:w-2/3">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {selectedLesson?.videoUrl ? (
                  <iframe
                    src={`${selectedLesson.videoUrl}?autoplay=false&preload=true&responsive=true&playsinline=true&fill=true`}
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '0.5rem'
                    }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-900 rounded-lg">
                    {user ? "No video available" : "Please enroll to watch this lesson"}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedLesson?.title || course.title}
                </h1>
                <p className="text-gray-600">{course.description}</p>
              </div>
            </div>

            {/* Course Content Section */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
                  <p className="text-sm text-gray-600">{course.lessons.length} lessons • {course.duration} total hours</p>
                </div>
                
                <div className="divide-y">
                  {course.lessons.map((lesson, index) => (
                    <button
                      key={`${lesson.id}-${index}`}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedLesson?.id === lesson.id ? 'bg-purple-50' : ''
                      } ${!lesson.isPreview && !user ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {lesson.isPreview ? (
                            <PlayIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="text-gray-900">{lesson.title}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>{lesson.duration}m</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 border-t">
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-purple-600">${course.price.toFixed(2)}</span>
                  </div>
                  {user ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 mb-2">
                        {course.lessons.some(lesson => lesson.isPreview) ? 
                          "Preview available - Watch sample lessons before enrolling" :
                          "Enroll to access all course content"}
                      </div>
                      <button 
                        className="w-full px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center"
                      >
                        <PlayIcon className="h-5 w-5 mr-2" />
                        Enroll Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 mb-2">
                        Sign in to enroll and access {course.lessons.length} lessons
                      </div>
                      <button 
                        className="w-full px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center"
                      >
                        <PlayIcon className="h-5 w-5 mr-2" />
                        Enroll Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 