import { create } from 'zustand';

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
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));