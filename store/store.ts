import { create } from 'zustand';
import { User, Language } from '../types';

interface AppState {
  isSidebarOpen: boolean;
  isAuthModalOpen: boolean;
  isLoggedIn: boolean;
  currentUser: User | null;
  language: Language;
  actions: {
    toggleSidebar: () => void;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    login: (user: User) => void;
    logout: () => void;
    setLanguage: (language: Language) => void;
  };
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: false,
  isAuthModalOpen: false,
  isLoggedIn: false,
  currentUser: null,
  language: 'ENG',
  actions: {
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),
    login: (user) => set({ isLoggedIn: true, currentUser: user }),
    logout: () => set({ isLoggedIn: false, currentUser: null }),
    setLanguage: (language) => set({ language }),
  },
}));
