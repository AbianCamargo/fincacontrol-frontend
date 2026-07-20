import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { reproduccionService } from '../services/reproduccion'
import { animalesService } from '../services/animales'

export default function ReproduccionForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const esEdicion = Boolean(id)

  const [vacas, setVacas] = useState([])
  const [toros, setToros] = useState([])
  const [form, setForm] = useState({
    animal_id: '',
    fecha_celo: '',
    esta_prenada: false,
    toro_id: '',
    observaciones: '',
  })

  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  // Carga vacas y toros activos para los selectores
  useEffect(() => {
    animalesService.listar().then(res => {
      const activos = res.data.filter(a => a.estado === 'activa')
      setVacas(activos.filter(a => a.sexo === 'vaca'))
      setToros(activos.filter(a => a.sexo === 'toro'))
    })
  }, [])

  // Si es edición, carga los datos del registro existente
  useEffect(() => {
    if (esEdicion) {
      reproduccionService.listar().then(res => {
        const registro = res.data.find(r => r.id === Number(id))
        if (registro) {
          setForm({
            animal_id: registro.animal_id,
            fecha_celo: registro.fecha_celo?.split('T')[0] || '',
            esta_prenada: registro.esta_prenada,
            toro_id: registro.toro_id || '',
            observaciones: registro.observaciones || '',
          })
        }
      })
    }
  }, [id, esEdicion])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setGuardando(true)

    try {
      if (esEdicion) {
        await reproduccionService.actualizar(id, form)
      } else {
        await reproduccionService.crear(form)
      }
      navigate('/reproduccion')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el registro.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-lg font-bold text-slate-800">
          {esEdicion ? 'Editar registro' : 'Nuevo registro reproductivo'}
        </h1>
        <p className="text-sm text-slate-400 mb-5">
          {esEdicion ? 'Actualiza el estado reproductivo' : 'Registra el estado reproductivo de una vaca'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4 max-w-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg flex flex-col gap-4">

          <div>
            <label className="block text-sm text-slate-500 mb-1">Vaca</label>
            <select
              name="animal_id"
              value={form.animal_id}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            >
              <option value="">Selecciona una vaca</option>
              {vacas.map(vaca => (
                <option key={vaca.id} value={vaca.id}>
                  #{vaca.numero_identificacion} {vaca.nombre ? `— ${vaca.nombre}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-1">Fecha del último celo</label>
            <input
              type="date"
              name="fecha_celo"
              value={form.fecha_celo}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="esta_prenada"
              checked={form.esta_prenada}
              onChange={handleChange}
            />
            La vaca está preñada
          </label>

          {form.esta_prenada && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <label className="block text-sm text-slate-500 mb-1">Toro (opcional)</label>
              <select
                name="toro_id"
                value={form.toro_id}
                onChange={handleChange}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
              >
                <option value="">No especificado</option>
                {toros.map(toro => (
                  <option key={toro.id} value={toro.id}>
                    #{toro.numero_identificacion} {toro.nombre ? `— ${toro.nombre}` : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-2">
                La fecha probable de parto se calculará automáticamente (283 días desde el celo).
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-500 mb-1">Observaciones (opcional)</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={guardando}
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/reproduccion')}
              className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2"
            >
              Cancelar
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}