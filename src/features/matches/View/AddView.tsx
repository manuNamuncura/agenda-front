import React, { useEffect, useState } from "react";
import { MatchForm } from "../components/MatchForm";
import { useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";
import type { Match } from "../../../types/match.types";
import { matchService } from "../services/match.service";

export const AddMatchView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matchToEdit, setMatchToEdit] = useState<Match | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const fetchMatch = async () => {
        try {
          const data = await matchService.getAllMatches();
          const found = data.find((m) => m.id === id);
          if (found) {
            setMatchToEdit(found);
          } else {
            navigate("/history");
          }
        } catch (error) {
          console.error("Error cargando partido:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMatch();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex h-[80bh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500 pb-24">
      <div className="max-w-xl mx-auto">
        {/* Encabezado con botón de regreso */}
        <div className="mb-10 text-left sm:text-left">
          <h2 className="text-3xl font-black tracking-tighter uppercase">
            {id ? "Editar Encuentro" : "Nuevo Partido"}
          </h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">
            {id ? "Actualiza las estadísticas" : "Registra tu victoria hoy"}
          </p>
        </div>

        {/* Contenedor del Formulario */}
        <div className="bg-white/3 border border-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-sm">
          <MatchForm
            onSuccess={() => navigate("/history")}
            initialData={matchToEdit}
          />
        </div>

        {/* Tip Informativo */}
        <div className="mt-12 p-6 bg-blue-500/5 border border-blue-500/10 rounded-4xl flex gap-4 items-center">
          <div className="shrink-0 w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
            💡
          </div>
          <p className="text-blue-400/80 text-[11px] leading-relaxed">
            Tu <b>Desempeño</b> es clave. Lo usamos para ajustar tu nivel de
            habilidad en el ranking global de la comunidad.
          </p>
        </div>
      </div>
    </div>
  );
};
