import { create } from 'zustand';

export const useSidebarStore = create((set) => ({
  collapsed: false,
  toggleSidebar: () => set((s) => ({ collapsed: !s.collapsed })),
  setSidebar: (collapsed) => set({ collapsed }),
}));
