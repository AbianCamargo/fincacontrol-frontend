import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { vacunasService } from '../services/vacunas'

export default function Vacunas() {
  const [vacunas, setVacunas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState('todas')

  const cargarVacunas = () => {
    setCargando(true)
    vacunasService.listar()
      .then(res => setVacunas(res.data))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarVacunas()
  }, [])

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este registro de vacuna? Esta acción no se puede deshacer.')) return

    await vacunasService.eliminar(id)
    cargarVacunas()
  }

  // Calcula el estado de cada vacuna según su fecha próxima
  const calcularEstado = (proximaFecha) => {
    if (!proximaFecha) return 'sin_fecha'

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fecha = new Date(proximaFecha.split('T')[0])
    const diffDias = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24))

    if (diffDias < 0) return 'vencida'
    if (diffDias <= 30) return 'proxima'
    return 'al_dia'
  }

  // Filtra las vacunas según el tab seleccionado
  const vacunasFiltradas = vacunas.filter(v => {
    if (filtro === 'todas') return true
    return calcularEstado(v.proxima_fecha) === filtro
  })

  const totalVencidas = vacunas.filter(v => calcularEstado(v.proxima_fecha) === 'vencida').length
  const totalProximas = vacunas.filter(v => calcularEstado(v.proxima_fecha) === 'proxima').length

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Vacunas y tratamientos</h1>
            <p className="text-sm text-slate-400">Control de vacunación del hato</p>
          </div>
          <Link
            to="/vacunas/nueva"
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Registrar vacuna
          </Link>
        </div>

        {/* Tabs de filtro */}
        <div className="flex gap-1 bg-slate-200 rounded-lg p-1 w-fit mb-4">
          <TabFiltro label="Todas" activo={filtro === 'todas'} onClick={() => setFiltro('todas')} />
          <TabFiltro label={`Vencidas (${totalVencidas})`} activo={filtro === 'vencida'} onClick={() => setFiltro('vencida')} />
          <TabFiltro label={`Próximas (${totalProximas})`} activo={filtro === 'proxima'} onClick={() => setFiltro('proxima')} />
          <TabFiltro label="Al día" activo={filtro === 'al_dia'} onClick={() => setFiltro('al_dia')} />
        </div>

        {/* Banner de alerta si hay vacunas vencidas */}
        {totalVencidas > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            ⚠️ Hay {totalVencidas} vacuna{totalVencidas > 1 ? 's' : ''} vencida{totalVencidas > 1 ? 's' : ''} que requiere{totalVencidas > 1 ? 'n' : ''} atención.
          </div>
        )}

        {/* Tabla */}
        {cargando ? (
          <p className="text-sm text-slate-400">Cargando...</p>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Animal</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Vacuna/Tratamiento</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Fecha aplicada</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Próxima dosis</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Estado</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vacunasFiltradas.map(vacuna => (
                  <tr key={vacuna.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2 font-semibold text-slate-800">
                      #{vacuna.animal?.numero_identificacion}
                    </td>
                    <td className="px-4 py-2 text-slate-600">{vacuna.tipo}</td>
                    <td className="px-4 py-2 text-slate-600">{vacuna.fecha_aplicada?.split('T')[0]}</td>
                    <td className="px-4 py-2 text-slate-600">{vacuna.proxima_fecha?.split('T')[0] || '—'}</td>
                    <td className="px-4 py-2">
                      <BadgeEstado estado={calcularEstado(vacuna.proxima_fecha)} />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-3">
                        <Link
                          to={`/vacunas/${vacuna.id}/editar`}
                          className="text-xs text-slate-500 hover:text-blue-700 font-semibold"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleEliminar(vacuna.id)}
                          className="text-xs text-slate-500 hover:text-red-600 font-semibold"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {vacunasFiltradas.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No hay vacunas registradas en esta categoría.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

// Botón de tab para el filtro
function TabFiltro({ label, activo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
        activo ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  )
}

// Etiqueta de color según el estado de la vacuna
function BadgeEstado({ estado }) {
  const estilos = {
    vencida: ['bg-red-100 text-red-700', 'Vencida'],
    proxima: ['bg-amber-100 text-amber-700', 'Próxima'],
    al_dia: ['bg-green-100 text-green-700', 'Al día'],
    sin_fecha: ['bg-slate-100 text-slate-500', 'Sin fecha'],
  }
  const [clase, texto] = estilos[estado]

  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${clase}`}>
      {texto}
    </span>
  )
}