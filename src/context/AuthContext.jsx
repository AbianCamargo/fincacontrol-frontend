import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  // Verifica si hay una sesión activa al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      api.get('/me')
        .then(res => setUsuario(res.data))
        .catch(() => {
          // Token inválido o expirado — limpia la sesión
          localStorage.removeItem('token')
          setUsuario(null)
        })
        .finally(() => setCargando(false))
    } else {
      setCargando(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUsuario(res.data.user)
  }

  const logout = async () => {
    await api.post('/logout')
    localStorage.removeItem('token')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para consumir el contexto desde cualquier componente
export function useAuth() {
  return useContext(AuthContext)
}