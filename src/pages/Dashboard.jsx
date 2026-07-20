import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../services/api'

export default function Dashboard() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setDatos(res.data))
      .finally(() => setCargando(false))
  }, [])

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-400 mb-5">Resumen general del hato</p>

        {cargando ? (
          <p className="text-sm text-slate-400">Cargando...</p>
        ) : (
          <>
            {/* Tarjetas de indicadores */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              <TarjetaIndicador
                label="Animales activos"
                valor={datos.total_animales}
                color="text-blue-700"
              />
              <TarjetaIndicador
                label="Preñadas"
                valor={datos.total_prenadas}
                color="text-green-600"
              />
              <TarjetaIndicador
                label="Vacunas próximas"
                valor={datos.vacunas_proximas}
                color="text-amber-600"
              />
              <TarjetaIndicador
                label="Partos este mes"
                valor={datos.partos_mes}
                color="text-slate-800"
              />
            </div>

            {/* Alertas y partos del mes */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h2 className="text-sm font-bold text-slate-800 mb-3">Alertas de vacunas</h2>
                {datos.alertas_vacunas.length === 0 ? (
                  <p className="text-sm text-slate-400">No hay vacunas próximas a vencer.</p>
                ) : (
                  datos.alertas_vacunas.map(vacuna => (
                    <div key={vacuna.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                      <span className="text-slate-800">
                        {vacuna.animal?.numero_identificacion} — {vacuna.tipo}
                      </span>
                      <span className="text-xs text-slate-400">{vacuna.proxima_fecha}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h2 className="text-sm font-bold text-slate-800 mb-3">Partos del mes</h2>
                {datos.partos_del_mes.length === 0 ? (
                  <p className="text-sm text-slate-400">No hay partos registrados este mes.</p>
                ) : (
                  datos.partos_del_mes.map(parto => (
                    <div key={parto.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                      <span className="text-slate-800">
                        {parto.madre?.numero_identificacion} — {parto.fecha_parto?.split('T')[0]}
                      </span>
                      <span className={`text-xs font-semibold ${parto.resultado === 'vivo' ? 'text-green-600' : 'text-red-600'}`}>
                        {parto.resultado === 'vivo' ? 'Vivo' : 'Muerto'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// Componente pequeño para cada tarjeta de indicador
function TarjetaIndicador({ label, valor, color }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{valor}</p>
    </div>
  )
}