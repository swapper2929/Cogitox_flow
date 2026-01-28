import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem('cogitox_user'),
  user: JSON.parse(localStorage.getItem('cogitox_user') || 'null'),
  
  login: (user, token) => {
    localStorage.setItem('cogitox_user', JSON.stringify(user));
    localStorage.setItem('cogitox_token', token);
    set({ isAuthenticated: true, user });
  },
  
  logout: () => {
    localStorage.removeItem('cogitox_user');
    localStorage.removeItem('cogitox_token');
    set({ isAuthenticated: false, user: null });
  },
  
  setUser: (user) => set({ user }),
}));
