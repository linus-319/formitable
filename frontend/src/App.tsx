import { useEffect } from "react"
import { Routes, Route, Navigate } from 'react-router-dom'

import SignupPage from "./pages/SignupPage"
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

import ProtectedRoute from './components/ProtectedRoute'

import { getCsrfToken } from './api/client'
import AuthProvider from "./context/AuthProvider";

function App() {

  useEffect(() => {
    getCsrfToken().catch((error) => {
      console.error("Failed to initialize CSRF:", error);
    });
  }, []);

  return (
    <AuthProvider>
      <main>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/signup" replace />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;