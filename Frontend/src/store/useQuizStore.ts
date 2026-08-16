import { create } from 'zustand';
import api from '../lib/api';

interface Question {
  _id?: string;
  text?: string;
  questionText?: string;
  options: string[];
  correctAnswer?: string;
  correctOption?: number;
}

interface Quiz {
  _id: string;
  course: string | any;
  title: string;
  questions: Question[];
  totalPoints: number;
  timeLimit: number;
  passingScore?: number;
  difficultyLevel?: 'Easy' | 'Medium' | 'Hard';
  isFinalQuiz?: boolean;
}

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  loading: boolean;
  error: string | null;

  fetchQuizzesByCourse: (courseId: string) => Promise<void>;
  fetchQuizById: (quizId: string) => Promise<void>;
  createQuiz: (data: any) => Promise<void>;
  startQuizAttempt: (quizId: string) => Promise<any>;
  autoSaveAnswer: (quizId: string, attemptId: string, questionId: string, studentAnswer: string) => Promise<any>;
  fetchMyQuizAttempts: (quizId: string) => Promise<any>;
  submitQuizAttempt: (quizId: string, payload: { attemptId?: string; isTimedOut?: boolean; answers: Array<{ questionId: string; studentAnswer: string }> } | Array<{ questionId: string; studentAnswer: string }>) => Promise<any>;
  getAssignedFinalQuiz: (courseId: string) => Promise<any>;
  clearQuizzesForCourse: (courseId: string) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  quizzes: [],
  currentQuiz: null,
  loading: false,
  error: null,

  clearQuizzesForCourse: (courseId: string) =>
    set((state) => ({
      quizzes: state.quizzes.filter(
        (q) => (q.course?._id || (q.course as any)) !== courseId
      ),
      currentQuiz:
        (state.currentQuiz?.course?._id || (state.currentQuiz?.course as any)) === courseId
          ? null
          : state.currentQuiz,
    })),

  fetchQuizzesByCourse: async (courseId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/quizzes/course/${courseId}`);
      set({ quizzes: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to load quizzes', loading: false });
    }
  },

  fetchQuizById: async (quizId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/quizzes/${quizId}`);
      set({ currentQuiz: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to load quiz', loading: false });
    }
  },

  createQuiz: async (data: any) => {
    set({ loading: true, error: null });
    try {
      await api.post('/quizzes', data);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create quiz', loading: false });
      throw error;
    }
  },

  startQuizAttempt: async (quizId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/quizzes/${quizId}/start`);
      set({ loading: false });
      return res.data;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to start quiz attempt', loading: false });
      throw error;
    }
  },

  autoSaveAnswer: async (quizId: string, attemptId: string, questionId: string, studentAnswer: string) => {
    try {
      const res = await api.post(`/quizzes/${quizId}/auto-save`, { attemptId, questionId, studentAnswer });
      return res.data;
    } catch (error: any) {
      console.error('Failed to auto-save answer:', error);
    }
  },

  fetchMyQuizAttempts: async (quizId: string) => {
    try {
      const res = await api.get(`/quizzes/${quizId}/my-attempts`);
      return res.data;
    } catch (error: any) {
      console.error('Failed to fetch quiz attempts:', error);
      return [];
    }
  },

  submitQuizAttempt: async (quizId: string, payload: any) => {
    set({ loading: true, error: null });
    try {
      const body = Array.isArray(payload) ? { answers: payload } : payload;
      const res = await api.post(`/quizzes/${quizId}/attempt`, body);
      set({ loading: false });
      return res.data;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to submit quiz attempt', loading: false });
      throw error;
    }
  },

  getAssignedFinalQuiz: async (courseId: string) => {
    try {
      const res = await api.get(`/quizzes/course/${courseId}/adaptive-final`);
      return res.data;
    } catch (error: any) {
      console.error('Failed to fetch assigned final quiz:', error);
      return { isUnlocked: false, message: 'Failed to load adaptive final quiz assessment.' };
    }
  }
}));
