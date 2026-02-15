import { Outlet } from "react-router";
import { BottomNav } from "../../components/ui/BottomNav"; // Ajusta la ruta

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Contenedor del contenido dinámico */}
      <main className="pb-24">
        {/* el pb-24 es vital para que el contenido no quede oculto detrás del navbar */}
        <Outlet />
      </main>

      {/* Navegación Fija */}
      <BottomNav />
    </div>
  );
}
