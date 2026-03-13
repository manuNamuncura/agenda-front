import { Outlet } from "react-router";
import { BottomNav } from "../../components/ui/BottomNav";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="pb-24">
        <Outlet />
      </main>

      {/* Navegación Fija */}
      <BottomNav />
    </div>
  );
}
