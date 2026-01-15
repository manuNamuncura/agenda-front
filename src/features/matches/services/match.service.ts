import apiClient from "../../../api/apiClient";
import type { Match } from "../../../types/match.types";

export const matchService = {
    getRecentMatches: async (): Promise<Match[]> => {
        const { data } = await apiClient.get<Match[]>('/matches/recent');
        return data;
    },

    async createMatch(matchData: any) {
        const { data } = await apiClient.post('/matches', matchData)
        return data;
    },

    async deleteMatch(id: string) {
        await apiClient.delete(`/matches/${id}`)
    }
}