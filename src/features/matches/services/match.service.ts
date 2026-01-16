import apiClient from "../../../api/apiClient";
import type { Match } from "../../../types/match.types";

export type UpdateMatchDTO = Partial<Omit<Match, "date">> & { date?: string };

export const matchService = {
  getRecentMatches: async (): Promise<Match[]> => {
    const { data } = await apiClient.get<Match[]>("/matches/recent");
    return data;
  },

  async createMatch(data: UpdateMatchDTO): Promise<Match> {
    const response = await apiClient.post("/matches", data);
    return response.data;
  },

  async deleteMatch(id: string) {
    await apiClient.delete(`/matches/${id}`);
  },

  async updateMatch(id: string, data: UpdateMatchDTO): Promise<Match> {
    const response = await apiClient.patch(`/matches/${id}`, data);
    return response.data;
  },
};
