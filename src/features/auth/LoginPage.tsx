import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "./store/useAuthStore";
import { authService } from "./services/auth.service";
import SpotlightCard from "../../components/bits/SpotlightCard";
import { Mail, Trophy, Lock, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

// 1. Definimos el esquema de validación con Zod
const loginSchema = z.object({
  identifier: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Extraemos el tipo del esquema
type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // 2. Inicializamos React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Valida mientras el usuario escribe
  });

  const onSubmit = async (data: LoginFormValues) => {
    toast.promise(authService.login(data.identifier, data.password), {
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Campo Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Usuario
            </label>
            <div className="relative mt-1">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${errors.identifier ? "text-red-500" : "text-gray-500"}`}
              >
                <Mail size={18} />
              </span>
              <input
                {...register("identifier")}
                type="text"
                placeholder="tu_usuario"
                className={`w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-white transition-all outline-none
                  ${
                    errors.identifier
                      ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                      : "border-white/10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                  }`}
              />
            </div>
            {errors.identifier && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.identifier.message}
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
                  ${
                    errors.password
                      ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                      : "border-white/10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                  }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle size={12} /> {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-green-600 py-3 font-semibold text-white transition-all hover:bg-green-500 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Calentando..." : "Entrar a la Cancha"}
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
