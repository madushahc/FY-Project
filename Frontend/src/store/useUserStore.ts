import { create } from 'zustand';
import api from '../lib/api';

interface NotificationType {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

interface UserState {
  user: any;
  notifications: NotificationType[];
  badges: any[];
  points: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  fetchGamification: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  initializeUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  notifications: [],
  badges: [],
  points: 0,
  loading: false,
  error: null,

  initializeUser: () => {
    if (typeof window !== 'undefined') {
       const userStr = localStorage.getItem('user');
       if (userStr) {
          try { set({ user: JSON.parse(userStr) }); } catch(e) {}
       }
    }
  },

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/notifications');
      set({ notifications: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchGamification: async () => {
    set({ loading: true, error: null });
    try {
      // we would normally have an endpoint to fetch points, maybe using user profile.
      // Assuming gamification/badges endpoint returns earned badges:
      const response = await api.get('/gamification/badges'); 
      set({ badges: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) => 
          n._id === id ? { ...n, isRead: true } : n
        )
      }));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  }
}));
