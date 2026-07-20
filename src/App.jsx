import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

// Protege rutas que requieren autenticación
function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()

  if (cargando) return null

  return usuario ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}