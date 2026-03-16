import type { Match } from "../../../types/match.types";

export const calculateHomeStats = (matches: Match[]) => {
  const total = matches.length;
  if (total === 0) {
    return { total: 0, wins: 0, winRate: 0, avgGoals: "0.0" };
  }

  const wins = matches.filter((m) => m.result === "WON").length;
  const winRate = Math.round((wins / total) * 100);
  const totalGoals = matches.reduce((acc, m) => acc + m.goalsFor, 0);
  const avgGoals = (totalGoals / total).toFixed(1);

  return { total, wins, winRate, avgGoals };
};