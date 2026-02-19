import React, { useState, useEffect } from "react";
import { matchService } from "../services/match.service";
import type { Match } from "../../../types/match.types";
import MatchCard from "../components/MatchCard";
import { Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const HistoryView: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState<
    "ALL" | "WON" | "LOST" | "TIED"
  >("ALL");

  // 1. Cargar datos de la API al montar el componente
  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await matchService.getAllMatches();
      setMatches(data);
    } catch (error) {
      toast.error("No se pudieron cargar los partidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  // 2. Función para eliminar (Real)
  const handleDelete = async (id: string) => {

    try {
      await matchService.deleteMatch(id);
      toast.success("Partido eliminado");
      // Filtramos el estado local para no recargar toda la página
      setMatches((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  // 3. Lógica de filtrado (sobre los datos de la API)
  const filteredMatches = matches.filter((match) => {
    const matchesSearch = match.placeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesResult =
      filterResult === "ALL" || match.result === filterResult;
    return matchesSearch && matchesResult;
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-xs font-black tracking-widest uppercase">
          Cargando historial...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-in slide-in-from-right duration-500">
      <div className="max-w-4xl mx-auto">
        {/* TÍTULO Y BUSCADOR (Igual que antes) */}
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tighter mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            HISTORIAL
          </h2>
          <div className="flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Buscar cancha..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
              {(["ALL", "WON", "LOST", "TIED"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterResult(type)}
                  className={`flex-1 min-w-[80px] py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                    filterResult === type
                      ? "bg-white text-black shadow-lg"
                      : "text-gray-500"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LISTA DE PARTIDOS REALES */}
        <div className="space-y-4 pb-24">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onDelete={handleDelete}
                onEdit={() => navigate(`/edit/${match.id}`) }
              />
            ))
          ) : (
            <div className="text-center py-20 opacity-40">
              <p className="text-lg font-bold">No hay partidos registrados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
