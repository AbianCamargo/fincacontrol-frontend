import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 p-8 w-full max-w-sm">

        {/* Logo y título */}
        <div className="flex items-center justify-center gap-3 mb-2">

          <span className="text-xl font-bold text-slate-800">Finca Villarreal-Inés</span>
        </div>
        <p className="text-center text-sm text-slate-400 mb-6">
          Sistema de gestión ganadera
        </p>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-500 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="usuario@finca.com"
              required
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="h-10 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Indicador de seguridad */}
        <p className="text-center text-xs text-slate-400 mt-6">
          🔒 Conexión segura · HTTPS
        </p>
      </div>
    </div>
  )
}