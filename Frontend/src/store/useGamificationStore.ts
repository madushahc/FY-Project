import { create } from 'zustand';
import api from '../lib/api';

interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category?: string;
  triggerEvent?: string;
  thresholdValue?: number;
  pointsBonus?: number;
  isVisible?: boolean;
  active?: boolean;
}

interface GamificationState {
  badges: Badge[];
  leaderboard: any[];
  loading: boolean;
  error: string | null;

  fetchLeaderboard: () => Promise<void>;

  fetchBadges: () => Promise<void>;
  createBadge: (data: any) => Promise<void>;
  awardPoints: (studentId: string, points: number, reason: string) => Promise<void>;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  badges: [],
  leaderboard: [],
  loading: false,
  error: null,

  fetchLeaderboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/gamification/leaderboard');
      set({ leaderboard: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to load leaderboard', loading: false });
    }
  },

  fetchBadges: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/gamification/badges');
      set({ badges: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to load badges', loading: false });
    }
  },

  createBadge: async (data: any) => {
    set({ loading: true, error: null });
    try {
      await api.post('/gamification/badges', data);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create badge', loading: false });
      throw error;
    }
  },

  awardPoints: async (studentId: string, points: number, reason: string) => {
    set({ loading: true, error: null });
    try {
      await api.post('/gamification/award', { studentId, points, reason });
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to award points', loading: false });
      throw error;
    }
  }
}));
