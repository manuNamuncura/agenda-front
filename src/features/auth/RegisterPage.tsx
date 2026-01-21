import { useState } from "react";
import { authService } from "./services/auth.service";
import { useAuthStore } from "./store/useAuthStore";
import { useNavigate } from "react-router";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Llamada al servicio
      const response = await authService.signUp(formData);
      
      // 2. Guardar en el store global (esto ya maneja el localStorage)
      setAuth(response);
      
      // 3. Redirigir al inicio/agenda
      navigate("/agenda");
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("No se pudo crear el usuario. Revisa los datos.");
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Crear Perfil de Jugador</h2>
        
        <input type="text" placeholder="Username" className="border p-2"
          onChange={(e) => setFormData({...formData, username: e.target.value})} required />
        
        <input type="text" placeholder="Nombre completo" className="border p-2"
          onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        
        <input type="email" placeholder="Email" className="border p-2"
          onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        
        <input type="password" placeholder="Password" className="border p-2"
          onChange={(e) => setFormData({...formData, password: e.target.value})} required />

        <button type="submit" className="bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700">
          Registrar y Entrar
        </button>
      </form>
    </div>
  );
};