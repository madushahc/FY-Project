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
}

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  loading: boolean;
  error: string | null;

  fetchQuizzesByCourse: (courseId: string) => Promise<void>;
  fetchQuizById: (quizId: string) => Promise<void>;
  createQuiz: (data: any) => Promise<void>;
  submitQuizAttempt: (quizId: string, answers: Array<{ questionId: string; studentAnswer: string }>) => Promise<any>;
}

export const useQuizStore = create<QuizState>((set) => ({
  quizzes: [],
  currentQuiz: null,
  loading: false,
  error: null,

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

  submitQuizAttempt: async (quizId: string, answers: Array<{ questionId: string; studentAnswer: string }>) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/quizzes/${quizId}/attempt`, { answers });
      set({ loading: false });
      return res.data;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to submit quiz attempt', loading: false });
      throw error;
    }
  }
}));
