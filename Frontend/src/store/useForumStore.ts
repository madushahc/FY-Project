import { create } from "zustand";
import api from "../lib/api";

interface Reply {
  _id: string;
  user: string | any;
  content: string;
  createdAt: string;
}

interface Post {
  _id: string;
  course: string | any;
  author: string | any;
  title: string;
  content: string;
  replies: Reply[];
  createdAt: string;
}

interface ForumState {
  posts: Post[];
  loading: boolean;
  error: string | null;

  fetchPostsByCourse: (courseId: string) => Promise<void>;
  createPost: (data: {
    course: string;
    title: string;
    content: string;
  }) => Promise<void>;
  replyToPost: (postId: string, content: string) => Promise<void>;
}

export const useForumStore = create<ForumState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPostsByCourse: async (courseId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/forums/course/${courseId}`);
      set({ posts: res.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to load posts",
        loading: false,
      });
    }
  },

  createPost: async (data: {
    course: string;
    title: string;
    content: string;
  }) => {
    set({ loading: true, error: null });
    try {
      await api.post("/forums", data);
      await get().fetchPostsByCourse(data.course); // Refresh posts after create
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create post",
        loading: false,
      });
      throw error;
    }
  },
  replyToPost: async (postId: string, content: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/forums/${postId}/reply`, { content });
      set({ loading: false });
      return res.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to reply to post",
        loading: false,
      });
      throw error;
    }
  },

  likePost: async (postId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/forums/${postId}/like`);
      set({ loading: false });
      return res.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to like post",
        loading: false,
      });
      throw error;
    }
  },

  likeReply: async (postId: string, replyId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/forums/${postId}/reply/${replyId}/like`);
      set({ loading: false });
      return res.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to like reply",
        loading: false,
      });
      throw error;
    }
  },
}));
