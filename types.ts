
export enum View {
  HOME = 'HOME',
  COURSES = 'COURSES',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  CERTIFICATE = 'CERTIFICATE',
  EDIT_COURSE = 'EDIT_COURSE',
  CREATE_COURSE = 'CREATE_COURSE',
}

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: CourseLevel;
  price: number; // In GHC
  tags: string[];
  image: string;
  requirements?: string[]; // New: List of requirements for completion
}

export interface User {
  id: string;
  name: string;
  email: string;
  registeredCourseIds: string[];
  completedCourseIds: string[];
  pendingCourseIds: string[];
  courseProgress: { [courseId: string]: number }; // Mapping of courseId to percentage (0-100)
  completionEvidence?: { [courseId: string]: string }; // New: Mapping of courseId to evidence text
  role: 'student' | 'admin';
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}