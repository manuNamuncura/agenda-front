// src/features/matches/components/MatchForm.tsx
import React, { useState, useEffect } from "react";
import { matchService, type UpdateMatchDTO } from "../services/match.service";
import type { Match } from "../../../types/match.types";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import { TimePickerCustom } from "../../../components/ui/TimesPickerCustom";

interface MatchFormProps {
  onSuccess: () => void;
  initialData?: Match | null;
}

export const MatchForm: React.FC<MatchFormProps> = ({
  onSuccess,
  initialData,
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTimeString, setSelectedTimeString] = useState("00:00");

  const [formData, setFormData] = useState({
    courtType: "FIVE",
    category: "FRIENDS",
    placeName: "",
    goalsFor: 0,
    goalsAgainst: 0,
    result: "WON",
    performance: "GOOD",
  });

  // Cargar sugerencias de lugares existentes
  useEffect(() => {
    loadPlaceSuggestions();
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      const dateObj = new Date(initialData.date);
      setSelectedDate(dateObj);
      setSelectedTimeString(dateObj.toTimeString().slice(0, 5));

      setFormData({
        courtType: initialData.courtType,
        category: initialData.category,
        placeName: initialData.placeName,
        goalsFor: initialData.goalsFor,
        goalsAgainst: initialData.goalsAgainst,
        result: initialData.result,
        performance: initialData.performance,
      });
    } else {
      const now = new Date();
      setSelectedDate(now);
      setSelectedTimeString(now.toTimeString().slice(0, 5));
    }
  }, [initialData]);

  const loadPlaceSuggestions = async () => {
    try {
      // Obtener partidos del usuario para extraer lugares únicos
      const matches = await matchService.getAllMatches();

      const placesMap = new Map();

      matches.forEach(match => {
        if (match.placeName) {
          // Normalizar: minúsculas, sin espacios extra
          const normalized = match.placeName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ');

          // Mantener el nombre original más usado o el primero
          if (!placesMap.has(normalized)) {
            placesMap.set(normalized, match.placeName);
          }
        }
      });

      // Extraer lugares únicos de los partidos
      const uniquePlaces = Array.from(
        new Set(matches.map(match => match.placeName).filter(Boolean))
      ).sort();

      setSuggestions(uniquePlaces);
    } catch (err) {
      console.error('Error al cargar sugerencias:', err);
    }
  };

  const handlePlaceChange = (value: string) => {
    setFormData({ ...formData, placeName: value });

    // Filtrar sugerencias
    const filtered = suggestions.filter(place =>
      place.toLowerCase().includes(value.toLowerCase())
    );
    setShowSuggestions(value.length > 0 && filtered.length > 0);
  };

  const selectSuggestion = (place: string) => {
    setFormData({ ...formData, placeName: place });
    setShowSuggestions(false);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setSelectedTimeString(newTime);
  };

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

    if (!selectedDate || isNaN(selectedDate.getTime())) {
      toast.error("Por favor selecciona una fecha válida");
      return;
    }

    if (!formData.placeName.trim()) {
      toast.error("Por favor ingresa un lugar");
      return;
    }

    setLoading(true);

    try {
      const [hours, minutes] = selectedTimeString.split(":").map(Number);
      const finalDate = new Date(selectedDate);
      finalDate.setHours(hours, minutes, 0, 0);

      const gFor = Number(formData.goalsFor);
      const gAgainst = Number(formData.goalsAgainst);

      let calculatedResult: Match['result'] = 'TIED';
      if (gFor > gAgainst) calculatedResult = 'WON';
      else if (gFor < gAgainst) calculatedResult = 'LOST';

      const payload: UpdateMatchDTO = {
        ...formData,
        result: calculatedResult,
        date: finalDate.toISOString(),
        placeId: formData.placeName.trim().toLowerCase().replace(/\s+/g, "-"),
        goalsFor: Number(formData.goalsFor),
        goalsAgainst: Number(formData.goalsAgainst),
        courtType: formData.courtType as Match['courtType'],
        category: formData.category as Match['category'],
        performance: formData.performance as Match['performance'],
      };

      if (initialData) {
        await matchService.updateMatch(initialData.id, payload);
        toast.success("¡Partido actualizado!", { icon: "🔄" });
      } else {
        await matchService.createMatch(payload);
        toast.success("¡Partido registrado!", { icon: "🔥" });
      }

      onSuccess();
    } catch (err) {
      toast.error("Error al procesar el partido");
      console.error("Error en MatchForm:", err);
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
        <h3 className="text-xl font-black tracking-tight">
          {initialData ? "EDITAR PARTIDO" : "NUEVO PARTIDO"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Lugar con autocompletado */}
        <div className="space-y-2 relative">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
            Lugar de la Cancha
          </label>
          <input
            type="text"
            placeholder="Ej: Stadium 5"
            required
            className="w-full bg-gray/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-green-500/50 transition-all placeholder:text-gray-700"
            value={formData.placeName}
            onChange={(e) => handlePlaceChange(e.target.value)}
            onFocus={() => {
              if (formData.placeName.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {/* Sugerencias de autocompletado */}
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl">
              <div className="py-2">
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Lugares anteriores
                </div>
                {suggestions
                  .filter(place =>
                    place.toLowerCase().includes(formData.placeName.toLowerCase())
                  )
                  .map((place, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestion(place)}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-t border-white/5 first:border-t-0 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <span className="font-medium">{place}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* El resto de tu formulario permanece igual... */}
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
                className={`py-2 rounded-xl text-[10px] font-bold transition-all border ${formData.courtType === type
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
            Fecha de Partido
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            locale={es}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-green-500/50"
            showTimeSelect={false}
            showPopperArrow={false}
            popperPlacement="bottom-start"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
            Hora de Partido
          </label>
          <TimePickerCustom
            selectedTime={selectedTimeString}
            onChange={handleTimeChange}
            minuteInterval={10}
            hourInterval={1}
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
                className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all duration-300 ${formData.performance === p.value
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
          {loading
            ? "GUARDANDO..."
            : initialData
              ? "ACTUALIZAR CAMBIOS"
              : "REGISTRAR PARTIDO"}
        </button>
      </form>
    </div>
  );
};