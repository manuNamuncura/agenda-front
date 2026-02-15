import { NavLink } from "react-router";
import { Home, Calendar, PlusSquare, BarChart2, User } from "lucide-react";

const navItems = [
  { path: "/home", icon: Home, label: "Inicio" },
  { path: "/history", icon: Calendar, label: "Partidos" },
  { path: "/add", icon: PlusSquare, label: "Nuevo" },
  { path: "/stats", icon: BarChart2, label: "Stats" },
  { path: "/profile", icon: User, label: "Perfil" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-black/80 backdrop-blur-lg pb-safe">
      <div className="mx-auto flex max-w-lg items-center justify-around py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? "text-blue-500 scale-110"
                  : "text-gray-500 hover:text-gray-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
