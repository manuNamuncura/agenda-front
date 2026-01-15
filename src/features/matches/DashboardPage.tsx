// src/features/matches/DashboardPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../auth/store/useAuthStore";
import { matchService } from "./services/match.service";
import { MatchForm } from "./components/MatchForm";
import MatchCard from "./components/MatchCard";
import toast from "react-hot-toast";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

interface Match {
  id: string;
  placeName: string;
  date: Date;
  goalsFor: number;
  goalsAgainst: number;
  courtType: string;
  result: "WON" | "LOST" | "TIED";
}

const DashboardPage: React.FC = () => {
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState<
    "ALL" | "WON" | "LOST" | "TIED"
  >("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();

  const stats = {
    total: matches.length,
    wins: matches.filter((m) => m.result === "WON").length,
    winRate:
      matches.length > 0
        ? Math.round(
            (matches.filter((m) => m.result === "WON").length /
              matches.length) *
              100
          )
        : 0,
    avgGoals:
      matches.length > 0
        ? (
            matches.reduce((acc, m) => acc + m.goalsFor, 0) / matches.length
          ).toFixed(1)
        : 0,
  };

  const filteredMatches = matches.filter((match) => {
    const matchDate = new Date(match.date);
    const isSelectedYear = matchDate.getFullYear() === currentYear;
    const matchesSearch = match.placeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesResult =
      filterResult === "ALL" || match.result === filterResult;
    return isSelectedYear && matchesSearch && matchesResult;
  });

  const fetchMatches = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const data = await matchService.getRecentMatches();
      setMatches(data);
      setError(null);
    } catch (err: any) {
      console.error("Error al cargar partidos:", err);
      setError("No se pudieron cargar los partidos. Verifica tu conexión.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      toast.success("Prueba");
      fetchMatches();
    }
  }, [isAuthenticated, token, fetchMatches]);

  const handleDeleteClick = (id: string) => {
    setMatchToDelete(id);
    setIsModalOpen(true);
  }

  const confirmDelete = async () => {
    if (!matchToDelete) return;

    toast.promise(
      matchService.deleteMatch(matchToDelete),
      {
        loading: 'Borrando...',
        success: () => {
          fetchMatches();
          return 'Partido eliminado';
        },
        error: 'Error al borrar',
      }
    )
  }

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
    if (winRate >= 45)
      return {
        label: "ORO",
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20",
        icon: "🥇",
      };
    return {
      label: "AMATEUR",
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
      icon: "⚽",
    };
  };

  const winRateNum = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
  const rank = getPlayerRank(winRateNum, stats.total);
  const lastFiveMatches = matches.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Mejorado */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-white/5 pb-8">
          <div className="flex items-center gap-5">
            {/* Avatar o Círculo de Rango */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border ${rank.border} ${rank.bg}`}
            >
              {rank.icon}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tighter">
                  {user?.name?.toUpperCase() || "JUGADOR"}
                </h1>
                {/* Badge de Rango */}
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] border ${rank.border} ${rank.bg} ${rank.color}`}
                >
                  {rank.label}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1 font-medium">
                Temporada {currentYear} • {stats.total} partidos jugados
              </p>

              {/* Historial de Forma: Last 5 */}
              <div className="flex items-center gap-2 mt-4">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-tighter mr-2">
                  Forma:
                </p>
                <div className="flex gap-1.5">
                  {lastFiveMatches.length > 0 ? (
                    lastFiveMatches.map((m) => (
                      <div
                        key={m.id}
                        title={
                          m.result === "WON"
                            ? "Victoria"
                            : m.result === "LOST"
                            ? "Derrota"
                            : "Empate"
                        }
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black transition-transform hover:scale-110 cursor-help ${
                          m.result === "WON"
                            ? "bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                            : m.result === "LOST"
                            ? "bg-red-500/20 text-red-500 border border-red-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-white/10"
                        }`}
                      >
                        {m.result === "WON"
                          ? "W"
                          : m.result === "LOST"
                          ? "L"
                          : "D"}
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-700 italic">
                      Sin datos recientes
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={logout}
              className="flex-1 md:flex-none bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/10 hover:border-red-500/50 px-6 py-3 rounded-2xl transition-all text-xs font-bold uppercase tracking-widest"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card Win Rate */}
          <div className="relative overflow-hidden bg-linear-to-br from-green-500/10 to-transparent p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
              Win Rate
            </p>
            <div className="flex items-end gap-2 mt-2">
              <p className="text-5xl font-black text-white">{stats.winRate}%</p>
              <p className="text-green-500 text-sm font-bold mb-1">↑</p>
            </div>
            <div className="w-full bg-white/5 h-2 mt-4 rounded-full">
              <div
                className="bg-green-500 h-full rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all duration-1000"
                style={{ width: `${stats.winRate}%` }}
              ></div>
            </div>
          </div>

          {/* Card Goles Promedio */}
          <div className="bg-linear-to-br from-blue-500/10 to-transparent p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
              Promedio Goles
            </p>
            <p className="text-5xl font-black text-white mt-2">
              {stats.avgGoals}
            </p>
            <p className="text-blue-400/60 text-[10px] mt-2 font-bold uppercase tracking-widest text-right">
              Per Game
            </p>
          </div>

          {/* Card Total Partidos */}
          <div className="bg-linear-to-br from-purple-500/10 to-transparent p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
              Total Matches
            </p>
            <p className="text-5xl font-black text-white mt-2">{stats.total}</p>
            <div className="flex gap-1 mt-4">
              {matches.slice(0, 5).map((m, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    m.result === "WON" ? "bg-green-500" : "bg-red-500/30"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <MatchForm onSuccess={fetchMatches} />
            </div>
          </div>

          {/* Barra de Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            {/* Buscador */}
            <div className="relative w-full md:w-72 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 group-focus-within:text-green-500 transition-colors"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7-0 11-14 0 7 7-0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar cancha..."
                className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Selectores de Resultado (Tabs) */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full md:w-auto">
              {(["ALL", "WON", "LOST"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterResult(type)}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                    filterResult === type
                      ? "bg-white text-black shadow-lg"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {type === "ALL"
                    ? "TODOS"
                    : type === "WON"
                    ? "VICTORIAS"
                    : "DERROTAS"}
                </button>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Lista de Partidos */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-green-500 rounded-full"></span>
              Partidos Recientes
            </h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden min-h-100">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : filteredMatches.length > 0 ? (
                <div className="flex flex-col gap-3 mt-8">
                  {filteredMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <p className="text-xl">Aún no tienes partidos registrados</p>
                  <p className="text-sm">¡Usa el formulario para empezar!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="¿Borrar Partido?"
        message="Esta acción no se puede deshacer. Perderás las estadísticas de este encuentro."
      />
    </div>
  );
};

export default DashboardPage;
