import { useState } from "react";
import { cn } from "../../../utils/cn";
import { Trash2, Edit3, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";

interface MatchCardProps {
  match: any;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

const MatchCard = ({ match, onDelete, onEdit }: MatchCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isWin = match.result === "WON";
  const isLost = match.result === "LOST";

  const performanceColors: Record<string, string> = {
    VERY_GOOD: "text-yellow-400 bg-yellow-400/10",
    GOOD: "text-green-400 bg-green-400/10",
    NEUTRAL: "text-blue-400 bg-blue-400/10",
    BAD: "text-orange-400 bg-orange-400/10",
    VERY_BAD: "text-red-400 bg-red-400/10",
  };

  const performanceEmojis: Record<string, string> = {
    VERY_GOOD: "🤩",
    GOOD: "🙂",
    NEUTRAL: "😐",
    BAD: "😕",
    VERY_BAD: "😫",
  };

  return (
    <>
      <div className="group bg-white/3 border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
        {/* SECCIÓN IZQUIERDA: Resultado y Datos Principales */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Avatar del Resultado */}
          <div
            className={cn(
              "relative w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center font-black text-lg md:text-xl shadow-lg transition-transform group-hover:scale-105",
              isWin
                ? "bg-green-500/20 text-green-500 shadow-green-500/10"
                : isLost
                  ? "bg-red-500/20 text-red-500 shadow-red-500/10"
                  : "bg-gray-500/20 text-gray-400",
            )}
          >
            {match.result === "WON" ? "W" : match.result === "LOST" ? "L" : "D"}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-white text-base md:text-lg truncate group-hover:text-green-400 transition-colors flex items-center gap-2">
              <MapPin size={14} className="text-gray-500" />
              {match.placeName}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">
              <span className="flex items-center gap-1">
                <CalendarIcon size={10} />
                {new Date(match.date).toLocaleDateString()}
              </span>
              <span className="hidden xs:inline text-gray-700">•</span>
              <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] md:text-[10px]">
                {match.courtType}
              </span>
            </div>
          </div>
        </div>

        {/* SECCIÓN DERECHA: Marcador y Botones */}
        <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
          {/* Marcador y Desempeño */}
          <div className="flex flex-col items-start sm:items-end">
            <p className="text-2xl md:text-3xl font-black tracking-tight text-white leading-none">
              {match.goalsFor}{" "}
              <span className="text-gray-600 text-lg md:text-xl">-</span>{" "}
              {match.goalsAgainst}
            </p>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase",
                performanceColors[match.performance] ||
                  "bg-gray-500/10 text-gray-400",
              )}
            >
              <span className="text-sm">
                {performanceEmojis[match.performance] || "😶"}
              </span>
              {match.performance.replace("_", " ") || "NEUTRAL"}
            </span>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 md:p-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all active:scale-95"
              title="Editar partido"
            >
              <Edit3 size={18} />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 md:p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
              title="Eliminar partido"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN (Fuera del flujo de la card para evitar problemas de z-index) */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(match.id)}
        title="¿Eliminar Partido?"
        message={`¿Estás seguro que quieres borrar el partido en "${match.placeName}"? Esta acción eliminará los goles y estadísticas permanentemente.`}
        confirmText="Sí, eliminar"
      />
    </>
  );
};

export default MatchCard;
