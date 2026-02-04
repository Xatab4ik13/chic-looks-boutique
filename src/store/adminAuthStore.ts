import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, useExternalApi } from "@/lib/api";

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; email: string } | null;
  login: (emailOrPassword: string, password?: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Простой пароль для фронтенд-защиты (используется если нет внешнего API)
const ADMIN_PASSWORD = "vox2024";

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,

      login: async (emailOrPassword: string, password?: string) => {
        set({ isLoading: true });

        try {
          // Если есть внешний API — используем JWT авторизацию
          if (useExternalApi && password) {
            const result = await authApi.login(emailOrPassword, password);
            set({ 
              isAuthenticated: true, 
              user: result.user,
              isLoading: false 
            });
            return true;
          }

          // Иначе — простая проверка пароля (для режима без бэкенда)
          if (emailOrPassword === ADMIN_PASSWORD) {
            set({ 
              isAuthenticated: true, 
              user: { id: 'local', email: 'admin@local' },
              isLoading: false 
            });
            return true;
          }

          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        if (useExternalApi) {
          authApi.logout();
        }
        set({ isAuthenticated: false, user: null });
      },

      checkAuth: async () => {
        if (!useExternalApi) {
          // В режиме без бэкенда проверяем локальное состояние
          return;
        }

        set({ isLoading: true });
        
        try {
          const result = await authApi.checkAuth();
          if (result) {
            set({ isAuthenticated: true, user: result.user });
          } else {
            set({ isAuthenticated: false, user: null });
          }
        } catch {
          set({ isAuthenticated: false, user: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "vox-admin-auth",
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
