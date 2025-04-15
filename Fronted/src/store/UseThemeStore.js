import { create } from "zustand";
export const UseThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: async (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));