// src/features/matches/components/MatchForm.tsx
import React, { useState } from "react";
import { matchService } from "../services/match.service";
import toast from "react-hot-toast";

interface MatchFormProps {
  onSuccess: () => void;
}

export const MatchForm: React.FC<MatchFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    courtType: "FIVE",
    category: "FRIENDS",
    placeName: "",
    goalsFor: 0,
    goalsAgainst: 0,
    result: "WON",
    performance: "GOOD",
  });

  const performances = [
    {
      value: "VERY_BAD",
      emoji: "😫",
      label: "Horrible",
      color: "hover:bg-red-500/20 border-red-500/20",
    },
    {
      value: "BAD",
      emoji: "😕",
      label: "Malo",
      color: "hover:bg-orange-500/20 border-orange-500/20",
    },
    {
      value: "NEUTRAL",
      emoji: "😐",
      label: "Normal",
      color: "hover:bg-blue-500/20 border-blue-500/20",
    },
    {
      value: "GOOD",
      emoji: "🙂",
      label: "Bueno",
      color: "hover:bg-green-500/20 border-green-500/20",
    },
    {
      value: "VERY_GOOD",
      emoji: "🤩",
      label: "MVP",
      color: "hover:bg-yellow-500/20 border-yellow-500/20",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        placeId: formData.placeName.toLowerCase().replace(/\s+/g, "-"), // Placeholder
        goalsFor: Number(formData.goalsFor),
        goalsAgainst: Number(formData.goalsAgainst),
      };
      await matchService.createMatch(payload);
      toast.success('⚽ ¡Partido registrado con éxito!', {
        icon: '🔥',
        duration: 4000, 
      })
      onSuccess();
      setFormData((prev) => ({
        ...prev,
        placeName: "",
        goalsFor: 0,
        goalsAgainst: 0,
      }));
    } catch (err) {
      alert("Error al guardar el partido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/3 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </div>
        <h3 className="text-xl font-black tracking-tight">NUEVO PARTIDO</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Lugar */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
            Lugar de la Cancha
          </label>
          <input
            type="text"
            placeholder="Ej: Stadium 5"
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-green-500/50 transition-all placeholder:text-gray-700"
            value={formData.placeName}
            onChange={(e) =>
              setFormData({ ...formData, placeName: e.target.value })
            }
          />
        </div>

        {/* Marcador */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-green-500/70 ml-1">
              Goles Favor
            </label>
            <input
              type="number"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-2xl font-black text-white"
              value={formData.goalsFor}
              onChange={(e) =>
                setFormData({ ...formData, goalsFor: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-red-500/70 ml-1">
              Goles Contra
            </label>
            <input
              type="number"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-2xl font-black text-white"
              value={formData.goalsAgainst}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  goalsAgainst: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* Tipo de Cancha - Estilo Botones */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
            Tipo de Cancha
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["FIVE", "SEVEN", "ELEVEN"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, courtType: type })}
                className={`py-2 rounded-xl text-[10px] font-bold transition-all border ${
                  formData.courtType === type
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-gray-500 border-white/10 hover:border-white/30"
                }`}
              >
                F{type === "FIVE" ? "5" : type === "SEVEN" ? "7" : "11"}
              </button>
            ))}
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
            Fecha y Hora
          </label>
          <input
            type="datetime-local"
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-green-500/50"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
            ¿Cómo te sentiste en la cancha?
          </label>
          <div className="flex justify-between gap-2">
            {performances.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, performance: p.value })
                }
                className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all duration-300 ${
                  formData.performance === p.value
                    ? "bg-white/10 border-white shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-110"
                    : `bg-transparent border-white/5 ${p.color} grayscale hover:grayscale-0`
                }`}
              >
                <span className="text-2xl">{p.emoji}</span>
                <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">
                  {p.label} 
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-800 disabled:text-gray-600 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] mt-4 active:scale-95"
        >
          {loading ? "GUARDANDO..." : "REGISTRAR PARTIDO"}
        </button>
      </form>
    </div>
  );
};
