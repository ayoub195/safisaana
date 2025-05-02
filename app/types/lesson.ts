export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  isPreview: boolean;
  courseId: string;
  duration: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  isPaid: boolean;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
} 