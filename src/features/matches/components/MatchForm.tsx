// src/features/matches/components/MatchForm.tsx
import React, { useState, useEffect, useMemo } from "react";
import { matchService, type UpdateMatchDTO } from "../services/match.service";
import type { Match } from "../../../types/match.types";
import toast from "react-hot-toast";
import { TimePickerCustom } from "../../../components/ui/TimesPickerCustom";
import { Calendar, Plus, Minus, MapPin } from "lucide-react";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  // Generador de los últimos 7 días para el selector rápido
  const quickDates = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  }, []);

  useEffect(() => {
    loadPlaceSuggestions();
  }, []);

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
      const matches = await matchService.getAllMatches();
      const uniquePlaces = Array.from(
        new Set(matches.map((match) => match.placeName).filter(Boolean)),
      ).sort();
      setSuggestions(uniquePlaces);
    } catch (err) {
      console.error("Error al cargar sugerencias:", err);
    }
  };

  const handlePlaceChange = (value: string) => {
    setFormData({ ...formData, placeName: value });
    const filtered = suggestions.filter((place) =>
      place.toLowerCase().includes(value.toLowerCase()),
    );
    setShowSuggestions(value.length > 0 && filtered.length > 0);
  };

  const selectSuggestion = (place: string) => {
    setFormData({ ...formData, placeName: place });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      let calculatedResult: Match["result"] = "TIED";
      if (gFor > gAgainst) calculatedResult = "WON";
      else if (gFor < gAgainst) calculatedResult = "LOST";

      const payload: UpdateMatchDTO = {
        ...formData,
        result: calculatedResult,
        date: finalDate.toISOString(),
        placeId: formData.placeName.trim().toLowerCase().replace(/\s+/g, "-"),
        goalsFor: gFor,
        goalsAgainst: gAgainst,
        courtType: formData.courtType as Match["courtType"],
        category: formData.category as Match["category"],
        performance: formData.performance as Match["performance"],
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
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* LUGAR */}
        <div className="space-y-3 relative">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
            Escenario
          </label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-green-500 transition-colors" />
            <input
              type="text"
              placeholder="Ej: Stadium 5"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500/50 transition-all"
              value={formData.placeName}
              onChange={(e) => handlePlaceChange(e.target.value)}
              onFocus={() =>
                formData.placeName.length > 0 && setShowSuggestions(true)
              }
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </div>

          {showSuggestions && (
            <div className="absolute z-20 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {suggestions
                .filter((p) =>
                  p.toLowerCase().includes(formData.placeName.toLowerCase()),
                )
                .map((place, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectSuggestion(place)}
                    className="w-full text-left px-5 py-4 hover:bg-white/5 border-b border-white/5 last:border-0 text-sm font-bold flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />{" "}
                    {place}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* SELECTOR DE FECHA RÁPIDO */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex justify-between">
            Día del Encuentro
            {selectedDate && (
              <span className="text-green-500">
                {selectedDate.toLocaleDateString()}
              </span>
            )}
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {quickDates.map((date, index) => {
              const isSelected =
                selectedDate.toDateString() === date.toDateString();
              const dayName = date.toLocaleDateString("es-ES", {
                weekday: "short",
              });
              const dayNum = date.getDate();
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all border ${
                    isSelected
                      ? "bg-green-500 border-green-500 text-black shadow-lg scale-105"
                      : "bg-white/5 border-white/5 text-gray-500 hover:border-white/20"
                  }`}
                >
                  <span
                    className={`text-[10px] font-black uppercase ${isSelected ? "text-black/60" : "text-gray-600"}`}
                  >
                    {index === 0 ? "Hoy" : dayName.replace(".", "")}
                  </span>
                  <span className="text-xl font-black">{dayNum}</span>
                </button>
              );
            })}
            <div className="shrink-0 w-16 h-20 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-gray-700">
              <Calendar size={20} />
            </div>
          </div>
        </div>

        {/* MARCADOR */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 text-center block">
              Favor
            </label>
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((f) => ({
                    ...f,
                    goalsFor: Math.max(0, f.goalsFor - 1),
                  }))
                }
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-white"
              >
                <Minus size={16} />
              </button>
              <span className="text-3xl font-black text-white">
                {formData.goalsFor}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData((f) => ({ ...f, goalsFor: f.goalsFor + 1 }))
                }
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-green-500"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 text-center block">
              Contra
            </label>
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((f) => ({
                    ...f,
                    goalsAgainst: Math.max(0, f.goalsAgainst - 1),
                  }))
                }
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-white"
              >
                <Minus size={16} />
              </button>
              <span className="text-3xl font-black text-white">
                {formData.goalsAgainst}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData((f) => ({
                    ...f,
                    goalsAgainst: f.goalsAgainst + 1,
                  }))
                }
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-red-500"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* HORA */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
            Hora
          </label>
          <TimePickerCustom
            selectedTime={selectedTimeString}
            onChange={setSelectedTimeString}
            minuteInterval={10}
            hourInterval={1}
          />
        </div>

        {/* PERFORMANCE */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
            Tu nivel hoy
          </label>
          <div className="flex justify-between gap-2">
            {performances.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, performance: p.value })
                }
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                  formData.performance === p.value
                    ? "bg-white/10 border-white scale-110 shadow-xl"
                    : "bg-transparent border-white/5 grayscale opacity-40 hover:opacity-100"
                }`}
              >
                <span className="text-2xl">{p.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-800 disabled:text-gray-600 text-black font-black py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)] active:scale-95"
        >
          {loading
            ? "PROCESANDO..."
            : initialData
              ? "GUARDAR CAMBIOS"
              : "REGISTRAR PARTIDO"}
        </button>
      </form>
    </div>
  );
};
