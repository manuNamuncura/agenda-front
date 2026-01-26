// src/features/auth/services/auth.service.ts

import apiClient from "../../../api/apiClient";
import type { AuthResponse } from "../../../types/auth.types";

export const authService = {
  login: async (
    identifier: string,
    password: string,
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post("/auth/signin", {
      identifier,
      password,
    });
    return {
      token: data.accessToken,
      user: data.user,
    };
  },

  signUp: async (userData: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post("/auth/signup", userData);
    return {
      token: data.accessToken,
      user: data.user,
    };
  },

  updateProfile: async (userData: any): Promise<any> => {
    const { data } = await apiClient.patch("/auth/profile", userData);
    return data;
  },

  getProfile: async () => {
    const { data } = await apiClient.get("/auth/profile");
    return data;
  },
};
