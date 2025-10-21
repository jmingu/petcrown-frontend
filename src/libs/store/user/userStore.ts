import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  profileImageUrl: string | null;
  birthDate: string;
  gender: string;
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  getAccessToken: () => string | null;
  clearUser: () => void;
  initializeFromLocalStorage: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => {
        // localStorage에도 저장 (기존 로직 유지)
        if (typeof window !== 'undefined') {
          localStorage.setItem('a_t', accessToken);
          localStorage.setItem('r_t', refreshToken);
        }
        set({ accessToken, refreshToken });
      },
      getAccessToken: () => {
        const state = get();
        if (state.accessToken) return state.accessToken;

        // zustand에 없으면 localStorage에서 가져오기
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('a_t');
          if (token) {
            set({ accessToken: token });
            return token;
          }
        }
        return null;
      },
      clearUser: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('a_t');
          localStorage.removeItem('r_t');
        }
        set({ user: null, accessToken: null, refreshToken: null });
      },
      initializeFromLocalStorage: () => {
        if (typeof window !== 'undefined') {
          const accessToken = localStorage.getItem('a_t');
          const refreshToken = localStorage.getItem('r_t');
          if (accessToken && refreshToken) {
            set({ accessToken, refreshToken });
          }
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      }),
    }
  )
);