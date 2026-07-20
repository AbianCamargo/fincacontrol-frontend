import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'

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

      {/* Ruta temporal hasta tener el Dashboard */}
      <Route
        path="/dashboard"
        element={
          <RutaProtegida>
            <div className="p-8 text-slate-800 font-semibold">
              ✅ Sesión iniciada correctamente
            </div>
          </RutaProtegida>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}