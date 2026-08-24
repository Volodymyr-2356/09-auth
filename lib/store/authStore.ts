import { create } from 'zustand';

interface User {
  email: string;
  username: string;
  avatar: string;
}
interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  clearIsAuthenticated: () => void;
}

export const useAuthStore = create<AuthStore>()(set => ({
  user: null,
  isAuthenticated: false,

  setUser: user =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearIsAuthenticated: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
