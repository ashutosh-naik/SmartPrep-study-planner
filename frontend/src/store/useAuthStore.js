import { create } from 'zustand';

const TOKEN_KEY = 'smartprep_token';
const USER_KEY  = 'smartprep_user';

const savedUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
};

export const useAuthStore = create((set) => ({
  user:  savedUser(),
  token: localStorage.getItem(TOKEN_KEY),
  setAuth: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null });
  },
  updateUser: (updatedData) => {
    set((state) => {
      const newUser = { ...state.user, ...updatedData };
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      return { user: newUser };
    });
  },
}));
