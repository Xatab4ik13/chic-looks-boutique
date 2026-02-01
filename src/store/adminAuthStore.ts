import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminAuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

// Простой пароль для фронтенд-защиты (позже заменить на бэкенд авторизацию)
const ADMIN_PASSWORD = "vox2024";

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false });
      },
    }),
    {
      name: "vox-admin-auth",
    }
  )
);
