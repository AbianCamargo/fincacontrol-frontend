import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { reproduccionService } from '../services/reproduccion'

export default function Reproduccion() {
  const [registros, setRegistros] = useState([])
  const [cargando, setCargando] = useState(true)

  const cargarRegistros = () => {
    setCargando(true)
    reproduccionService.listar()
      .then(res => setRegistros(res.data))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarRegistros()
  }, [])

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este registro reproductivo? Esta acción no se puede deshacer.')) return

    await reproduccionService.eliminar(id)
    cargarRegistros()
  }

  const totalPrenadas = registros.filter(r => r.esta_prenada).length
  const totalSinRegistro = registros.filter(r => !r.esta_prenada).length

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Reproducción</h1>
            <p className="text-sm text-slate-400">Estado reproductivo del hato</p>
          </div>
          <Link
            to="/reproduccion/nuevo"
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Nuevo registro
          </Link>
        </div>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 mb-1">Vacas preñadas</p>
            <p className="text-2xl font-bold text-purple-600">{totalPrenadas}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 mb-1">Sin preñez confirmada</p>
            <p className="text-2xl font-bold text-slate-600">{totalSinRegistro}</p>
          </div>
        </div>

        {/* Tabla */}
        {cargando ? (
          <p className="text-sm text-slate-400">Cargando...</p>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Animal</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Último celo</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">¿Preñada?</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Parto probable</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Toro</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map(registro => (
                  <tr key={registro.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2 font-semibold text-slate-800">
                      #{registro.animal?.numero_identificacion}
                    </td>
                    <td className="px-4 py-2 text-slate-600">{registro.fecha_celo?.split('T')[0]}</td>
                    <td className="px-4 py-2">
                      {registro.esta_prenada ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Sí</span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {registro.fecha_probable_parto?.split('T')[0] || '—'}
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {registro.toro ? `#${registro.toro.numero_identificacion}` : '—'}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-3">
                        <Link
                          to={`/reproduccion/${registro.id}/editar`}
                          className="text-xs text-slate-500 hover:text-blue-700 font-semibold"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleEliminar(registro.id)}
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

            {registros.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No hay registros reproductivos.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}