import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { Toaster } from 'react-hot-toast'; 
import './App.css';
import { useAuthStore } from './features/auth/store/useAuthStore';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/matches/DashboardPage';
import { RegisterPage } from './features/auth/RegisterPage';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Ruta Pública */}
        <Route
          path='/login'
          element={!isAuthenticated ? <LoginPage/> : <Navigate to="/dashboard" replace/>}
        />

        <Route
          path='/register'
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace/>}
        />

        {/* Ruta Privada: Dashboard */}
        <Route
          path='/dashboard'
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
        />

        {/* Redirección inicial */}
        <Route
          path='/'
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;