import React, { useEffect, useState, useMemo } from "react";
import { matchService } from "../services/match.service";
import type { Match } from "../../../types/match.types";
import { Loader2, MapPin } from "lucide-react";

export const StatsView: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await matchService.getAllMatches();
        setMatches(data || []);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Procesamos los datos reales agrupados por cancha
  const statsByPlace = useMemo(() => {
    const groups: Record<string, any> = {};

    matches.forEach((match) => {
      const name = match.placeName.trim().toUpperCase(); // Normalizamos para agrupar bien
      if (!groups[name]) {
        groups[name] = {
          name,
          total: 0,
          wins: 0,
          goalsFor: 0,
          goalsAgainst: 0,
        };
      }
      groups[name].total += 1;
      groups[name].goalsFor += match.goalsFor;
      groups[name].goalsAgainst += match.goalsAgainst;
      if (match.result === "WON") groups[name].wins += 1;
    });

    // Convertimos a array y ordenamos por donde más juega
    return Object.values(groups).sort((a, b) => b.total - a.total);
  }, [matches]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black tracking-tighter mb-2 flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            ANÁLISIS POR CANCHA
          </h2>
          <p className="text-gray-500 text-xs uppercase tracking-[0.2em] font-bold ml-5">
            ¿Dónde eres invencible?
          </p>
        </header>

        {statsByPlace.length === 0 ? (
          <div className="text-center py-20 bg-white/3 rounded-4xl border border-dashed border-white/10">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              Aún no hay partidos registrados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {statsByPlace.map((place) => {
              const winRate = Math.round((place.wins / place.total) * 100);

              return (
                <div
                  key={place.name}
                  className="group bg-white/3 border border-white/5 rounded-4xl p-6 hover:bg-white/5 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Info Principal */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <MapPin size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">
                          {place.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {place.total}{" "}
                            {place.total === 1 ? "Partido" : "Partidos"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-6 md:gap-12 text-center md:text-right">
                      <div>
                        <p className="text-gray-600 text-[9px] font-black uppercase tracking-tighter mb-1">
                          Efectividad
                        </p>
                        <p
                          className={`text-2xl font-black ${winRate >= 50 ? "text-green-400" : "text-red-400"}`}
                        >
                          {winRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-[9px] font-black uppercase tracking-tighter mb-1">
                          Goles +
                        </p>
                        <p className="text-2xl font-black text-white">
                          {place.goalsFor}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-[9px] font-black uppercase tracking-tighter mb-1">
                          Goles -
                        </p>
                        <p className="text-2xl font-black text-gray-400">
                          {place.goalsAgainst}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progreso Visual */}
                  <div className="w-full h-2 bg-white/5 rounded-full mt-6 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out"
                      style={{ width: `${winRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
