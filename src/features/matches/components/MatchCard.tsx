// src/features/matches/MatchCard.tsx

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

  // Mapeo de colores para el performance
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
    <div className="group bg-white/3 border border-white/10 rounded-2xl p-5 flex justify-between items-center hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
      <div className="flex items-center gap-5">
        {/* Indicador de Resultado Estilizado */}
        <div
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
            isWin
              ? "bg-green-500/20 text-green-500 shadow-green-500/10"
              : isLost
              ? "bg-red-500/20 text-red-500 shadow-red-500/10"
              : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {match.result === "WON" ? "W" : match.result === "LOST" ? "L" : "D"}
          {/* Decoración sutil */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-current opacity-50 animate-pulse"></div>
        </div>

        <div>
          <h4 className="font-bold text-white text-lg group-hover:text-green-400 transition-colors">
            {match.placeName}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
            <span>{new Date(match.date).toLocaleDateString()}</span>
            <span>•</span>
            <span className="bg-white/5 px-2 py-0.5 rounded text-[10px]">
              {match.courtType}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-3xl font-black tracking-tight text-white leading-none">
            {match.goalsFor} <span className="text-gray-600 text-xl">-</span>{" "}
            {match.goalsAgainst}
          </p>
          <span
            className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
              performanceColors[match.performance]
            }`}
          >
            {performanceEmojis[match.performance]}{" "}
            {match.performance.replace("_", " ")}
          </span>
        </div>

        <button
            onClick={onEdit} // 🚩 Botón Editar
            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

        <button
          onClick={() => onDelete(match.id)}
          className="opacity-100 lg:opacity-0 @media(hover:hover){ lg:group-hover:opacity-100 }bg-red-500/10 text-red-500 p-2.5 rounded-xl border border-red-500/20 transition-all @media(hover:hover){ hover:bg-red-500 hover:text-white }"
          title="Eliminar partido"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
