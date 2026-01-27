// src/features/auth/LoginPage.tsx

import React, { useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { authService } from "./services/auth.service";
import SpotlightCard from "../../components/bits/SpotlightCard";
import { Mail, Trophy, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.promise(authService.login(identifier, password), {
      loading: "Iniciando sesión...",
      success: (response) => {
        setAuth(response);
        navigate("/dashboard");
        return "¡Bienvenido de nuevo! ⚽";
      },
      error: (err: any) => {
        if (err?.response?.status === 401) {
          return "Usuario o contraseña incorrecta.";
        }
        return "Error al iniciar sesión.";
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-green-900/20 blur-[120px]" />
      </div>

      <SpotlightCard className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
            <Trophy size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Bienvenido, Crack
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Ingresa tus datos para registrar tus partidos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Usuario
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Mail size={18} />
              </span>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                placeholder="tu_usuario"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-xl bg-green-600 py-3 font-semibold text-white transition-all hover:bg-green-500 active:scale-[0.98] disabled:opacity-50"
          >
            "Entrar a la Cancha"
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-green-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </SpotlightCard>
    </div>
  );
};

export default LoginPage;
