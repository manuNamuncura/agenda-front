import apiClient from "../../../api/apiClient";
import type { AuthResponse } from "../../../types/auth.types";

export const authService = {
  login: async (
    identifier: string,
    password: string
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

  signUp: async (useData: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/signup",
      useData
    );
    return data;
  },

  getProfile: async () => {
    const { data } = await apiClient.get("/auth/profile");
    return data;
  },
};
