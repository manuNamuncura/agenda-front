import React, { useState, useEffect, useMemo } from "react";
import { matchService } from "../services/match.service";
import type { Match } from "../../../types/match.types";
import MatchCard from "../components/MatchCard";
import {
  Search,
  Loader2,
  Trophy,
  Target,
  Hash,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { cn } from "../../../utils/cn"; // Asegúrate de tener esta utilidad o cámbiala por string templates

export const HistoryView: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState<
    "ALL" | "WON" | "LOST" | "TIED"
  >("ALL");

  // Estado para controlar qué mes está expandido
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await matchService.getAllMatches();
      setMatches(data || []);

      // Opcional: Expandir el primer mes por defecto al cargar
      if (data && data.length > 0) {
        const firstMonth = new Date(data[0].date).toLocaleDateString("es-ES", {
          month: "long",
          year: "numeric",
        });
        setExpandedMonth(firstMonth);
      }
    } catch (error) {
      toast.error("No se pudieron cargar los partidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await matchService.deleteMatch(id);
      toast.success("Partido eliminado");
      setMatches((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  // --- LÓGICA DE FILTRADO, ESTADÍSTICAS Y AGRUPACIÓN ---
  const { groupedMatches, stats, totalFiltered } = useMemo(() => {
    const filtered = matches.filter((match) => {
      const matchesSearch = match.placeName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesResult =
        filterResult === "ALL" || match.result === filterResult;
      return matchesSearch && matchesResult;
    });

    const currentStats = filtered.reduce(
      (acc, m) => {
        acc.goals += m.goalsFor;
        if (m.result === "WON") acc.wins += 1;
        return acc;
      },
      { goals: 0, wins: 0 },
    );

    const groups: Record<string, Match[]> = {};
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    sorted.forEach((match) => {
      const date = new Date(match.date);
      const monthLabel = date.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      });
      if (!groups[monthLabel]) groups[monthLabel] = [];
      groups[monthLabel].push(match);
    });

    return {
      groupedMatches: groups,
      stats: currentStats,
      totalFiltered: filtered.length,
    };
  }, [matches, searchTerm, filterResult]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
        <p className="text-[10px] font-black tracking-[0.3em] uppercase">
          Sincronizando Historial...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in slide-in-from-right duration-500 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 italic">
            <span className="w-2 h-8 bg-green-500 rounded-full italic-none"></span>
            HISTORIAL
          </h2>
        </div>

        {/* MINI DASHBOARD (Compacto) */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white/3 border border-white/5 rounded-3xl p-4 text-center">
            <Hash size={14} className="mx-auto mb-1 text-gray-600" />
            <p className="text-xl font-black">{totalFiltered}</p>
            <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">
              Partidos
            </p>
          </div>
          <div className="bg-white/3 border border-white/5 rounded-3xl p-4 text-center">
            <Trophy size={14} className="mx-auto mb-1 text-yellow-500" />
            <p className="text-xl font-black">{stats.wins}</p>
            <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">
              Victorias
            </p>
          </div>
          <div className="bg-white/3 border border-white/5 rounded-3xl p-4 text-center">
            <Target size={14} className="mx-auto mb-1 text-blue-500" />
            <p className="text-xl font-black">{stats.goals}</p>
            <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">
              Goles
            </p>
          </div>
        </div>

        {/* BUSCADOR Y FILTROS */}
        <div className="mb-10 space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar por lugar..."
              className="w-full pl-12 pr-4 py-4 bg-white/3 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-green-500/50 transition-all font-bold placeholder:text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-white/3 p-1 rounded-[1.25rem] border border-white/5 overflow-x-auto no-scrollbar">
            {(["ALL", "WON", "LOST", "TIED"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterResult(type)}
                className={cn(
                  "flex-1 min-w-[85px] py-3 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase",
                  filterResult === type
                    ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                    : "text-gray-500",
                )}
              >
                {type === "ALL"
                  ? "TODOS"
                  : type === "WON"
                    ? "GANADOS"
                    : type === "LOST"
                      ? "PERDIDOS"
                      : "EMPATES"}
              </button>
            ))}
          </div>
        </div>

        {/* LISTA DE ACORDEONES POR MES */}
        <div className="space-y-4">
          {Object.keys(groupedMatches).length > 0 ? (
            Object.entries(groupedMatches).map(([month, monthMatches]) => {
              const isExpanded = expandedMonth === month;
              const monthWins = monthMatches.filter(
                (m) => m.result === "WON",
              ).length;
              const monthGoals = monthMatches.reduce(
                (acc, m) => acc + m.goalsFor,
                0,
              );

              return (
                <div key={month} className="group overflow-hidden">
                  {/* CABECERA RESUMEN DEL MES */}
                  <button
                    onClick={() => setExpandedMonth(isExpanded ? null : month)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 rounded-4xl border transition-all duration-500",
                      isExpanded
                        ? "bg-green-500 border-green-400 shadow-[0_15px_30px_rgba(34,197,94,0.15)]"
                        : "bg-white/3 border-white/5 hover:bg-white/5",
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <h3
                        className={cn(
                          "text-lg font-black uppercase tracking-tighter",
                          isExpanded ? "text-black" : "text-white",
                        )}
                      >
                        {month}
                      </h3>
                      <div
                        className={cn(
                          "flex gap-3 text-[9px] font-bold uppercase tracking-widest mt-1",
                          isExpanded ? "text-black/60" : "text-gray-500",
                        )}
                      >
                        <span>{monthMatches.length} Partidos</span>
                        <span>•</span>
                        <span>{monthWins} Wins</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-black tracking-tighter",
                          isExpanded
                            ? "bg-black/10 text-black"
                            : "bg-white/5 text-gray-400",
                        )}
                      >
                        {monthGoals} GOLES
                      </div>
                      <ChevronDown
                        size={20}
                        className={cn(
                          "transition-transform duration-500",
                          isExpanded
                            ? "rotate-180 text-black"
                            : "text-gray-600",
                        )}
                      />
                    </div>
                  </button>

                  {/* LISTA DESPLEGABLE DE PARTIDOS */}
                  <div
                    className={cn(
                      "grid gap-3 transition-all duration-500 ease-in-out overflow-hidden",
                      isExpanded
                        ? "mt-4 opacity-100 max-h-[2000px] pb-6"
                        : "max-h-0 opacity-0",
                    )}
                  >
                    {monthMatches.map((match) => (
                      <div
                        key={match.id}
                        className="pl-3 border-l-2 border-green-500/20 ml-6"
                      >
                        <MatchCard
                          match={match}
                          onDelete={handleDelete}
                          onEdit={() => navigate(`/edit/${match.id}`)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-24 opacity-40">
              <Search size={32} className="mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">
                Sin partidos en este filtro
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
