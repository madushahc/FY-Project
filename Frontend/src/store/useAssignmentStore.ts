import { create } from 'zustand';
import api from '../lib/api';

interface Assignment {
  _id: string;
  course: string | any;
  title: string;
  description: string;
  deadline: string;
  totalPoints: number;
}

interface Submission {
  _id: string;
  assignment: string | any;
  student: string | any;
  fileUrl: string;
  studentNotes?: string;
  score?: number;
  feedback?: string;
  status: string;
  submittedAt: string;
}

interface AssignmentState {
  assignments: Assignment[];
  mySubmissions: Submission[];
  loading: boolean;
  error: string | null;

  fetchAssignmentsByCourse: (courseId: string) => Promise<void>;
  fetchMySubmissions: () => Promise<void>;
  createAssignment: (data: any) => Promise<void>;
  submitAssignment: (assignmentId: string, formData: FormData) => Promise<void>;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => Promise<void>;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  mySubmissions: [],
  loading: false,
  error: null,

  fetchAssignmentsByCourse: async (courseId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/assignments/course/${courseId}`);
      set({ assignments: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to load assignments', loading: false });
    }
  },

  fetchMySubmissions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/submissions/my-submissions`);
      set({ mySubmissions: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to load submissions', loading: false });
    }
  },

  createAssignment: async (data: any) => {
    set({ loading: true, error: null });
    try {
      await api.post('/assignments', data);
      if (data.course) {
        await get().fetchAssignmentsByCourse(data.course);
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create assignment', loading: false });
      throw error;
    }
  },

  submitAssignment: async (assignmentId: string, formData: FormData) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/submissions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Optionally fetch submissions after
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to submit assignment', loading: false });
      throw error;
    }
  },

  gradeSubmission: async (submissionId: string, score: number, feedback: string) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/submissions/${submissionId}/grade`, { score, feedback });
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to grade submission', loading: false });
      throw error;
    }
  }
}));
