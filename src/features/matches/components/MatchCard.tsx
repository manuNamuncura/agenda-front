// src/features/matches/MatchCard.tsx
import { cn } from "../../../utils/cn";

const MatchCard = ({
  match,
  onDelete,
  onEdit,
}: {
  match: any;
  onDelete: (id: string) => void;
  onEdit: () => void;
}) => {
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
    <div className="group bg-white/3 border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
      
      {/* SECCIÓN IZQUIERDA: Info del partido */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div
          className={cn(
            "relative w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center font-black text-lg md:text-xl shadow-lg",
            isWin ? "bg-green-500/20 text-green-500" : 
            isLost ? "bg-red-500/20 text-red-500" : 
            "bg-gray-500/20 text-gray-400"
          )}
        >
          {match.result === "WON" ? "W" : match.result === "LOST" ? "L" : "D"}
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-current opacity-50 animate-pulse"></div>
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-white text-base md:text-lg truncate group-hover:text-green-400 transition-colors">
            {match.placeName}
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider">
            <span>{new Date(match.date).toLocaleDateString()}</span>
            <span className="hidden xs:inline">•</span>
            <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] md:text-[10px]">
              {match.courtType}
            </span>
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Marcador y Acciones */}
      <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
        
        {/* Marcador y Performance */}
        <div className="flex flex-col items-start sm:items-end">
          <p className="text-2xl md:text-3xl font-black tracking-tight text-white leading-none">
            {match.goalsFor} <span className="text-gray-600 text-lg md:text-xl">-</span> {match.goalsAgainst}
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase",
              performanceColors[match.performance]
            )}
          >
            <span className="text-sm">{performanceEmojis[match.performance]}</span>
            {match.performance.replace("_", " ")}
          </span>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 md:p-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(match.id)}
            className="p-2 md:p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
            title="Eliminar partido"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;