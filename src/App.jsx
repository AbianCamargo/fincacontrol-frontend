import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Animales from './pages/Animales'
import AnimalForm from './pages/AnimalForm'
import Partos from './pages/Partos'
import PartoForm from './pages/PartoForm'
import Vacunas from './pages/Vacunas'
import VacunaForm from './pages/VacunaForm'

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

      <Route
        path="/animales"
        element={
          <RutaProtegida>
            <Animales />
          </RutaProtegida>
        }
      />

      <Route
        path="/animales/nuevo"
        element={
          <RutaProtegida>
            <AnimalForm />
          </RutaProtegida>
        }
      />

      <Route
        path="/animales/:id/editar"
        element={
          <RutaProtegida>
            <AnimalForm />
          </RutaProtegida>
        }
      />

      <Route
        path="/partos"
        element={
          <RutaProtegida>
            <Partos />
          </RutaProtegida>
        }
      />

      <Route
        path="/partos/nuevo"
        element={
          <RutaProtegida>
            <PartoForm />
          </RutaProtegida>
        }
      />

      <Route
        path="/partos/:id/editar"
        element={
          <RutaProtegida>
            <PartoForm />
          </RutaProtegida>
        }
      />

      <Route
        path="/vacunas"
        element={
          <RutaProtegida>
            <Vacunas />
          </RutaProtegida>
        }
      />

      <Route
        path="/vacunas/nueva"
        element={
          <RutaProtegida>
            <VacunaForm />
          </RutaProtegida>
        }
      />

      <Route
        path="/vacunas/:id/editar"
        element={
          <RutaProtegida>
            <VacunaForm />
          </RutaProtegida>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}