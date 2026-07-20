import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { partosService } from '../services/partos'

export default function Partos() {
  const [partos, setPartos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    partosService.listar()
      .then(res => setPartos(res.data))
      .finally(() => setCargando(false))
  }, [])

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Partos</h1>
            <p className="text-sm text-slate-400">Historial de partos registrados</p>
          </div>
          <Link
            to="/partos/nuevo"
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Registrar parto
          </Link>
        </div>

        {/* Tabla */}
        {cargando ? (
          <p className="text-sm text-slate-400">Cargando...</p>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Madre</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Fecha de parto</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Resultado</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Cría</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Observaciones</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {partos.map(parto => (
                  <tr key={parto.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2 font-semibold text-slate-800">
                      #{parto.madre?.numero_identificacion}
                    </td>
                    <td className="px-4 py-2 text-slate-600">{parto.fecha_parto?.split('T')[0]}</td>
                    <td className="px-4 py-2">
                      <BadgeResultado resultado={parto.resultado} />
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {parto.cria ? `#${parto.cria.numero_identificacion}` : '—'}
                    </td>
                    <td className="px-4 py-2 text-slate-400">{parto.observaciones || '—'}</td>
                    <td className="px-4 py-2">
                    <Link
                        to={`/partos/${parto.id}/editar`}
                        className="text-xs text-slate-500 hover:text-blue-700 font-semibold"
                    >
                        Editar
                    </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {partos.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No hay partos registrados.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

// Etiqueta de color según el resultado del parto
function BadgeResultado({ resultado }) {
  const estilos = {
    vivo: 'bg-green-100 text-green-700',
    muerto: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${estilos[resultado]}`}>
      {resultado}
    </span>
  )
}