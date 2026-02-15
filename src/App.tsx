import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { DashboardLayout } from "./features/matches/DashboardLayout";
import { HomeView } from "./features/matches/View/HomeView";
import { HistoryView } from "./features/matches/View/HistoryView";
import { AddMatchView } from "./features/matches/View/AddView";
import { StatsView } from "./features/matches/View/StatsView";
import { ProfileView } from "./features/matches/View/ProfileView";
import { useAuthStore } from "./features/auth/store/useAuthStore";
import LoginPage from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        {/* RUTAS PÚBLICAS: Solo accesibles si NO estás logueado */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <RegisterPage />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        {/* RUTAS PRIVADAS: Solo accesibles si ESTÁS logueado */}
        <Route
          element={
            isAuthenticated ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/home" element={<HomeView />} />
          <Route path="/history" element={<HistoryView />} />
          <Route path="/add" element={<AddMatchView />} />
          <Route path="/edit/:id" element={<AddMatchView />} />
          <Route path="/stats" element={<StatsView />} />
          <Route path="/profile" element={<ProfileView />} />
        </Route>

        {/* Redirección inicial y 404 */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
