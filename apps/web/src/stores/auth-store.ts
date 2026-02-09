import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginRequest, LoginResponse, UserProfile } from '@pos/shared';
import { apiClient } from '@/lib/api-client';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: UserProfile) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),
      login: async (credentials: LoginRequest) => {
        try {
          const response = await apiClient.post<LoginResponse>(
            'auth/login',
            credentials
          );
          set({
            user: response.data.user,
            accessToken: response.data.accessToken,
            isAuthenticated: true,
          });
        } catch (error: any) {
          // Re-throw with better error message
          if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
          } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network')) {
            throw new Error('Cannot connect to server. Make sure the backend is running on port 3001.');
          } else {
            throw new Error(error.message || 'Login failed');
          }
        }
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
      setUser: (user: UserProfile) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
