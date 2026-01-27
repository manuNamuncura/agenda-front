// src/features/auth/RegisterPage.tsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import { authService } from "./services/auth.service";
import SpotlightCard from "../../components/bits/SpotlightCard";
import { User, Mail, Lock, Trophy, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.promise(
        authService.signUp(formData),
        {
            loading: "Creaando tu cuenta...",
            success: (response) => {
                setAuth(response);
                navigate('/dashboard');
                return "¡Registro con éxito! Bienvenido fútbol ⚽";
            },
            error: (err: any) => {
                if(err?.response?.status === 400) {
                    return "Usuario o email ya en uso";
                }
                return "No se pudo crear la cuenta";
            },
        },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-green-900/20 blur-[120px]" />
      </div>

      <SpotlightCard className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
            <Trophy size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Registrate para empezar a cargar tus partidos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Usuario
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                placeholder="tu_usuario"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Nombre completo
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                placeholder="Juan Pérez"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                placeholder="email@ejemplo.com"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                placeholder="••••••••"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-green-600 py-3 font-semibold text-white transition-all hover:bg-green-500 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Registrarse"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </SpotlightCard>
    </div>
  );
};
