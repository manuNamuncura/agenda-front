import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { matchService } from "../services/match.service";
import type { Match } from "../../../types/match.types";
import {
  LogOut,
  Trophy,
  Target,
  ShieldCheck,
  Calendar,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";

export const ProfileView: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAjusteModal, setShowAjusteModal] = useState(false);
  const [showTemporadaModal, setShowTemporadaModal] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const data = await matchService.getAllMatches();
        setMatches(data || []);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Cálculos de Carrera
  const careerStats = useMemo(() => {
    const total = matches.length;
    const goals = matches.reduce((acc, m) => acc + m.goalsFor, 0);
    const wins = matches.filter((m) => m.result === "WON").length;
    const efficiency = total > 0 ? Math.round((wins / total) * 100) : 0;

    return { total, goals, wins, efficiency };
  }, [matches]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* HEADER PERFIL */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative group">
            <div className="w-24 h-24 bg-linear-to-tr from-green-500 to-emerald-700 rounded-[2.5rem] flex items-center justify-center text-black shadow-2xl transition-transform group-hover:rotate-6">
              <UserIcon size={48} strokeWidth={2.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 p-2 rounded-xl">
              <ShieldCheck size={16} className="text-green-500" />
            </div>
          </div>

          <h2 className="text-3xl font-black tracking-tighter mt-6 uppercase">
            {user?.name || "Jugador"}
          </h2>
          <p className="text-gray-500 text-xs font-bold tracking-[0.3em] mt-1 uppercase">
            ID: {user?.id?.slice(-6) || "N/A"}
          </p>
        </div>

        {/* STATS DE CARRERA */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/3 border border-white/5 p-6 rounded-4xl text-center">
            <Trophy className="mx-auto mb-2 text-yellow-500" size={20} />
            <p className="text-2xl font-black">{careerStats.wins}</p>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
              Victorias
            </p>
          </div>
          <div className="bg-white/3 border border-white/5 p-6 rounded-4xl text-center">
            <Target className="mx-auto mb-2 text-blue-500" size={20} />
            <p className="text-2xl font-black">{careerStats.goals}</p>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
              Goles Totales
            </p>
          </div>
        </div>

        {/* LISTADO DE OPCIONES */}
        <div className="space-y-3">
          <button
            onClick={() => setShowAjusteModal(true)}
            className="w-full flex items-center justify-between p-5 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                <Settings size={20} />
              </div>
              <span className="text-sm font-bold">Ajustes de Cuenta</span>
            </div>
            <span className="text-gray-600">→</span>
          </button>

          <button
            onClick={() => setShowTemporadaModal(true)}
            className="w-full flex items-center justify-between p-5 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                <Calendar size={20} />
              </div>
              <span className="text-sm font-bold">Mi Temporada</span>
            </div>
            <span className="text-gray-600">→</span>
          </button>

          {/* BOTÓN CERRAR SESIÓN */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all group mt-6"
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
            <span className="text-sm font-black uppercase tracking-widest">
              Cerrar Sesión
            </span>
          </button>
        </div>

        {/* FOOTER APP VERSION */}
        <div className="mt-20 text-center">
          <p className="text-[10px] font-black text-gray-700 tracking-[0.5em] uppercase">
            AGENDA APP • v1.0.2
          </p>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE LOGOUT */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
        title="¿Cerrar Sesión?"
        message="¿Estás seguro de que quieres salir? Tendrás que volver a ingresar tus credenciales para acceder a tus estadísticas."
        confirmText="Cerrar Sesión"
        cancelText="Volver"
        variant="primary"
        icon={LogOut}
      />

      <ConfirmModal
        isOpen={showAjusteModal}
        onClose={() => setShowAjusteModal(false)}
        onConfirm={() => null}
        title="Próximamente"
        message="Estamos trabajando en esta sección para que puedas personalizar tu perfil al máximo. ¡Disponible en la v1.1!"
        showConfirm={false}
        icon={Settings}
        variant="primary"
      />

      <ConfirmModal
        isOpen={showTemporadaModal}
        onClose={() => setShowTemporadaModal(false)}
        onConfirm={() => null}
        title="Mi Temporada"
        message="Aquí podrás ver el resumen de tus victorias, derrotas y goles acumulados por mes. ¡Próximamente!"
        showConfirm={false}
        variant="primary"
        icon={Calendar}
      />
    </div>
  );
};
