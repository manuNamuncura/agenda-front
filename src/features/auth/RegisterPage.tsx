// src/features/auth/RegisterPage.tsx
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "./store/useAuthStore";
import { authService } from "./services/auth.service";
import SpotlightCard from "../../components/bits/SpotlightCard";
import { User, Mail, Lock, Trophy, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

// 1. Esquema de validación para Registro
const registerSchema = z
  .object({
    username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
    name: z.string().min(2, "Ingresa tu nombre completo"),
    email: z.string().email("Ingresa un correo electrónico válido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Debes confirmar tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"], // El error se mostrará en el campo confirmPassword
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // 2. Inicialización de React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormValues) => {
    // IMPORTANTE: Al enviar al backend, usualmente no necesitas enviar 'confirmPassword'
    // Desestructuramos para quitar confirmPassword y enviar el resto
    const { confirmPassword, ...registerData } = data;

    toast.promise(authService.signUp(registerData), {
      loading: "Creando tu cuenta...",
      success: (response) => {
        setAuth(response);
        navigate("/dashboard");
        return "¡Registro con éxito! Bienvenido Fútbol ⚽";
      },
      error: (err: any) => {
        if (err?.response?.status === 400) return "Usuario o email ya en uso";
        return "No se pudo crear la cuenta";
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Campo Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Usuario
            </label>
            <div className="relative mt-1">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${errors.username ? "text-red-500" : "text-gray-500"}`}
              >
                <User size={18} />
              </span>
              <input
                {...register("username")}
                type="text"
                placeholder="tu_usuario"
                className={`w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-white transition-all outline-none
                  ${errors.username ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20" : "border-white/10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"}`}
              />
            </div>
            {errors.username && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.username.message}
              </p>
            )}
          </div>

          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Nombre completo
            </label>
            <div className="relative mt-1">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${errors.name ? "text-red-500" : "text-gray-500"}`}
              >
                <User size={18} />
              </span>
              <input
                {...register("name")}
                type="text"
                placeholder="Juan Pérez"
                className={`w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-white transition-all outline-none
                  ${errors.name ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20" : "border-white/10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"}`}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="relative mt-1">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${errors.email ? "text-red-500" : "text-gray-500"}`}
              >
                <Mail size={18} />
              </span>
              <input
                {...register("email")}
                type="email"
                placeholder="email@ejemplo.com"
                className={`w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-white transition-all outline-none
                  ${errors.email ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20" : "border-white/10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"}`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <div className="relative mt-1">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${errors.password ? "text-red-500" : "text-gray-500"}`}
              >
                <Lock size={18} />
              </span>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-white transition-all outline-none
                  ${errors.password ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20" : "border-white/10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"}`}
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Confirmar Contraseña
            </label>
            <div className="relative mt-1">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${errors.confirmPassword ? "text-red-500" : "text-gray-500"}`}
              >
                <Lock size={18} />
              </span>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-white transition-all outline-none
                  ${
                    errors.confirmPassword
                      ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                      : "border-white/10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                  }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-green-600 py-3 font-semibold text-white transition-all hover:bg-green-500 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Entrenando..." : "Registrarse"}
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
