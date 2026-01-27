// src/features/auth/store/useAuthStore.ts

import { persist } from "zustand/middleware";
import type { AuthResponse, AuthState } from "../../../types/auth.types";
import { create } from "zustand";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (data: AuthResponse) => {
        // Guardar string puro para el interceptor
        localStorage.setItem("auth_token", data.token);

        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        });
      },

      updateUser: (userData: any) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      },

      logout: () => {
        localStorage.removeItem("auth_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
