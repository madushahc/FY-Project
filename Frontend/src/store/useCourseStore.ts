import { create } from "zustand";
import api from "../lib/api";
import { useUserStore } from "./useUserStore";
import { useQuizStore } from "./useQuizStore";
import { useAssignmentStore } from "./useAssignmentStore";

interface Course {
  _id: string;
  title: string;
  code?: string;
  department?: string;
  description: string;
  category?: string;
  thumbnailUrl?: string;
  status: string;
  instructor?: { name: string; email: string };
  modules?: any[];
  enrollmentCount?: number;
  enrollmentType?: string;
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

const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

const getCourseInstructorId = (course: Course) => {
  const instructor = course.instructor as any;
  return instructor?._id || instructor || null;
};

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
  deleteCourse: (id: string) => Promise<void>;
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
      const response = await api.get("/enrollments/my-enrollments");
      set({ myEnrollments: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchMyCreatedCourses: async () => {
    set({ loading: true, error: null });
    try {
      const currentUser = getStoredUser();
      // `getCourses` on backend returns all courses. If user is Lecturer, perhaps it filters them or they need to filter by themselves.
      const response = await api.get("/courses");
      // The backend needs a way to filter, but for now we expect a lecturer to get all courses, we can filter them by owner client-side if needed,
      // or we just set myCourses.
      const courses = Array.isArray(response.data) ? response.data : [];
      const myCourses =
        currentUser?.role === "Admin"
          ? courses
          : courses.filter(
              (course: Course) =>
                getCourseInstructorId(course)?.toString() ===
                currentUser?._id?.toString(),
            );

      set({ myCourses, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  enrollInCourse: async (courseId: string) => {
    set({ loading: true, error: null });
    try {
      await api.post("/enrollments", { courseId });
      await get().fetchMyEnrollments(); // Re-fetch list
      // Refresh notifications after enrolling
      try {
        const fetchNotifications = useUserStore.getState().fetchNotifications;
        if (fetchNotifications) await fetchNotifications();
      } catch (e) {}
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  fetchAvailableCourses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/courses");
      set({ availableCourses: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createCourse: async (data: any) => {
    set({ loading: true, error: null });
    try {
      await api.post("/courses", data);
      await get().fetchMyCreatedCourses();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  updateCourse: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/courses/${id}`, data);
      await get().fetchMyCreatedCourses();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  deleteCourse: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/courses/${id}`);
      set((state) => ({
        myCourses: state.myCourses.filter((c) => c._id !== id),
        availableCourses: state.availableCourses.filter((c) => c._id !== id),
        myEnrollments: state.myEnrollments.filter(
          (e) => (e.course?._id || (e.course as any)) !== id
        ),
        activeCourse: state.activeCourse?._id === id ? null : state.activeCourse,
        loading: false,
      }));
      // Clear quizzes and assignments from other Zustand stores
      try {
        useQuizStore.getState().clearQuizzesForCourse?.(id);
        useAssignmentStore.getState().clearAssignmentsForCourse?.(id);
      } catch {
        // Ignore store cleanup error if any
      }
      try {
        await Promise.all([
          get().fetchMyCreatedCourses(),
          get().fetchAvailableCourses(),
          get().fetchMyEnrollments(),
        ]);
      } catch {
        // Ignore background refetch error if unauthenticated for a specific role
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  uploadFile: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/upload", formData);
      return response.data.url;
    } catch (error: any) {
      console.error("File upload failed", error);
      throw error;
    }
  },

  fetchCourseById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/courses/${id}`);
      set({ activeCourse: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  markLessonCompleted: async (courseId: string, lessonId: string) => {
    try {
      let { myEnrollments } = get();
      let enrollment = myEnrollments.find(
        (e) => e && e.course && (((e.course as any)._id || e.course) === courseId)
      );

      if (!enrollment) {
        const response = await api.get("/enrollments/my-enrollments");
        set({ myEnrollments: response.data });
        enrollment = response.data.find(
          (e: any) => e && e.course && (((e.course as any)._id || e.course) === courseId)
        );
      }

      if (!enrollment) return;

      const res = await api.patch(`/enrollments/${enrollment._id}/progress`, {
        completedLessonId: lessonId,
      });

      // Update local Zustand state immediately so next lesson unlocks without delay
      set((state) => ({
        myEnrollments: state.myEnrollments.map((e) => {
          if (e._id === enrollment!._id) {
            const currentLessons = (e as any).completedLessons || [];
            const hasLesson = currentLessons.some((id: any) => String(id) === String(lessonId));
            return {
              ...e,
              progress: res.data.progress !== undefined ? res.data.progress : e.progress,
              completedLessons: hasLesson ? currentLessons : [...currentLessons, lessonId],
            };
          }
          return e;
        }),
      }));
    } catch (error) {
      console.error("Failed to mark lesson completed", error);
    }
  },
}));
