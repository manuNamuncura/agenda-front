import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../auth/store/useAuthStore";
import type { Match } from "../../../types/match.types";
import { matchService } from "../services/match.service";
import { Loader2 } from "lucide-react";

export const HomeView: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const user = useAuthStore((state) => state.user);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMathes = async () => {
      try {
        const data = await matchService.getAllMatches();
        setMatches(data);
      } catch (error) {
        console.error("Error cargando partidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMathes();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
      </div>
    );
  }

  const stats = {
    total: matches.length,
    wins: matches.filter((m) => m.result === "WON").length,
    winRate: Math.round(
      (matches.filter((m) => m.result === "WON").length / matches.length) * 100,
    ),
    avgGoals: (
      matches.reduce((acc, m) => acc + m.goalsFor, 0) / matches.length
    ).toFixed(1),
  };

  // Función de rango (la que ya tenías)
  const getPlayerRank = (winRate: number, totalMatches: number) => {
    if (totalMatches < 5)
      return {
        label: "PROMESA",
        color: "text-gray-400",
        bg: "bg-gray-400/10",
        border: "border-gray-400/20",
        icon: "🐣",
      };
    if (winRate >= 80)
      return {
        label: "LEYENDA",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20",
        icon: "👑",
      };
    if (winRate >= 60)
      return {
        label: "DIAMANTE",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20",
        icon: "💎",
      };
    return {
      label: "AMATEUR",
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
      icon: "⚽",
    };
  };

  const rank = getPlayerRank(stats.winRate, stats.total);

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        {/* HEADER: Identidad del Usuario */}
        <header className="flex items-center gap-5 mb-10 pb-8 border-b border-white/5">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border ${rank.border} ${rank.bg}`}
          >
            {rank.icon}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tighter uppercase">
                {user?.name || "Jugador"}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] border ${rank.border} ${rank.bg} ${rank.color}`}
              >
                {rank.label}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Temporada {currentYear} • {stats.total} partidos
            </p>
          </div>
        </header>

        {/* MÉTRICAS: Las 3 Cards Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Win Rate */}
          <div className="bg-linear-to-br from-green-500/10 to-transparent p-6 rounded-3xl border border-white/5">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
              Win Rate
            </p>
            <p className="text-5xl font-black mt-2">{stats.winRate}%</p>
            <div className="w-full bg-white/5 h-1.5 mt-4 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full"
                style={{ width: `${stats.winRate}%` }}
              />
            </div>
          </div>

          {/* Promedio Goles */}
          <div className="bg-linear-to-br from-blue-500/10 to-transparent p-6 rounded-3xl border border-white/5">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
              Goles Promedio
            </p>
            <p className="text-5xl font-black mt-2">{stats.avgGoals}</p>
          </div>

          {/* Forma (Últimos 5) */}
          <div className="bg-linear-to-br from-purple-500/10 to-transparent p-6 rounded-3xl border border-white/5">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">
              Últimos 5
            </p>
            <div className="flex gap-2">
              {matches.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                    m.result === "WON"
                      ? "bg-green-500 text-black"
                      : m.result === "LOST"
                        ? "bg-red-500/20 text-red-500 border border-red-500/20"
                        : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {m.result[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACCIÓN RÁPIDA: Un pequeño banner para motivar */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
          <h3 className="text-xl font-bold mb-2">¿Jugaste hoy?</h3>
          <p className="text-gray-500 text-sm mb-6">
            No olvides registrar tu partido para mantener tus stats al día.
          </p>
          <button className="bg-white text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
            Registrar Resultado
          </button>
        </div>
      </div>
    </div>
  );
};
