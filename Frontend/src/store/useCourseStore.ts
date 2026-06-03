import { create } from 'zustand';
import api from '../lib/api';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  status: string;
  instructor?: { name: string; email: string };
  modules?: any[];
  enrollmentCount?: number;
}

interface Enrollment {
  _id: string;
  course: Course;
  progress: number;
}

interface Analytics {
  activeStudents: number;
  participationRate: number;
  pendingGrades: number;
  avgCompletion: number;
}

interface CourseState {
  myCourses: Course[]; // Lecturer's created courses
  myEnrollments: Enrollment[]; // Student's enrollments
  availableCourses: Course[]; // All published courses for students to browse
  analytics: Analytics | null;
  activeCourse: Course | null;
  loading: boolean;
  error: string | null;
  
  fetchMyEnrollments: () => Promise<void>;
  fetchMyCreatedCourses: () => Promise<void>;
  fetchAvailableCourses: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  createCourse: (data: any) => Promise<void>;
  updateCourse: (id: string, data: any) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
  fetchCourseById: (id: string) => Promise<void>;
  markLessonCompleted: (courseId: string, lessonId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  myCourses: [],
  myEnrollments: [],
  availableCourses: [],
  analytics: null, // Hardcoded for now unless backend provides specific analytics API
  activeCourse: null,
  loading: false,
  error: null,

  fetchMyEnrollments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/enrollments/my-enrollments');
      set({ myEnrollments: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  fetchMyCreatedCourses: async () => {
    set({ loading: true, error: null });
    try {
      // `getCourses` on backend returns all courses. If user is Lecturer, perhaps it filters them or they need to filter by themselves.
      const response = await api.get('/courses');
      // The backend needs a way to filter, but for now we expect a lecturer to get all courses, we can filter them by owner client-side if needed, 
      // or we just set myCourses.
      set({ myCourses: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  enrollInCourse: async (courseId: string) => {
    set({ loading: true, error: null });
    try {
      await api.post('/enrollments', { courseId });
      await get().fetchMyEnrollments(); // Re-fetch list
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  fetchAvailableCourses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/courses'); 
      set({ availableCourses: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  createCourse: async (data: any) => {
    set({ loading: true, error: null });
    try {
      await api.post('/courses', data);
      await get().fetchMyCreatedCourses();
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  updateCourse: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/courses/${id}`, data);
      await get().fetchMyCreatedCourses();
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  uploadFile: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/upload', formData);
      return response.data.url;
    } catch (error: any) {
      console.error('File upload failed', error);
      throw error;
    }
  },

  fetchCourseById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/courses/${id}`);
      set({ activeCourse: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  markLessonCompleted: async (courseId: string, lessonId: string) => {
    try {
      const { myEnrollments } = get();
      const enrollment = myEnrollments.find(e => (e.course as any)._id === courseId || e.course === courseId as any);
      if (!enrollment) return;
      
      await api.patch(`/enrollments/${enrollment._id}/progress`, { completedLessonId: lessonId });
      await get().fetchMyEnrollments(); // Refetch to get updated progress/completedLessons
    } catch (error) {
      console.error("Failed to mark lesson completed", error);
    }
  }
}));
