import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { usuario, logout } = useAuth()

  // Clases de estilo según si el link está activo o no
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-semibold'
        : 'text-slate-600 hover:bg-slate-50'
    }`

  return (
    <aside className="w-52 bg-white border-r border-slate-200 flex flex-col h-screen">

      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-slate-200">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
          🐄
        </div>
        <span className="font-bold text-slate-800 text-sm">FincaControl</span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="text-xs font-semibold text-slate-400 px-4 mb-1 uppercase">Principal</p>
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/animales" className={linkClass}>Animales</NavLink>

        <p className="text-xs font-semibold text-slate-400 px-4 mb-1 mt-4 uppercase">Registros</p>
        <NavLink to="/partos" className={linkClass}>Partos</NavLink>
        <NavLink to="/vacunas" className={linkClass}>Vacunas</NavLink>
        <NavLink to="/reproduccion" className={linkClass}>Reproducción</NavLink>

        {/* Solo el Admin ve la gestión de usuarios */}
        {usuario?.rol === 'admin' && (
          <>
            <p className="text-xs font-semibold text-slate-400 px-4 mb-1 mt-4 uppercase">Admin</p>
            <NavLink to="/usuarios" className={linkClass}>Usuarios</NavLink>
          </>
        )}
      </nav>

      {/* Usuario y logout */}
      <div className="p-3 border-t border-slate-200">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
            {usuario?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{usuario?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{usuario?.rol}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full mt-1 text-xs text-slate-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors text-left"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}