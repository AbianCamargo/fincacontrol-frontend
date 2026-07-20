import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { vacunasService } from '../services/vacunas'
import { animalesService } from '../services/animales'

export default function VacunaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const esEdicion = Boolean(id)

  const [animales, setAnimales] = useState([])
  const [form, setForm] = useState({
    animal_id: '',
    tipo: '',
    fecha_aplicada: '',
    proxima_fecha: '',
    aplicada_por: '',
    observaciones: '',
  })

  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  // Carga todos los animales activos para el selector
  useEffect(() => {
    animalesService.listar().then(res => {
      const activos = res.data.filter(a => a.estado === 'activa')
      setAnimales(activos)
    })
  }, [])

  // Si es edición, carga los datos de la vacuna existente
  useEffect(() => {
    if (esEdicion) {
      vacunasService.listar().then(res => {
        const vacuna = res.data.find(v => v.id === Number(id))
        if (vacuna) {
          setForm({
            animal_id: vacuna.animal_id,
            tipo: vacuna.tipo,
            fecha_aplicada: vacuna.fecha_aplicada?.split('T')[0] || '',
            proxima_fecha: vacuna.proxima_fecha?.split('T')[0] || '',
            aplicada_por: vacuna.aplicada_por || '',
            observaciones: vacuna.observaciones || '',
          })
        }
      })
    }
  }, [id, esEdicion])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setGuardando(true)

    try {
      if (esEdicion) {
        await vacunasService.actualizar(id, form)
      } else {
        await vacunasService.crear(form)
      }
      navigate('/vacunas')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la vacuna.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-lg font-bold text-slate-800">
          {esEdicion ? 'Editar vacuna' : 'Registrar vacuna'}
        </h1>
        <p className="text-sm text-slate-400 mb-5">
          {esEdicion ? 'Actualiza los datos de la vacuna' : 'Registra una nueva vacuna o tratamiento'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4 max-w-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg flex flex-col gap-4">

          <div>
            <label className="block text-sm text-slate-500 mb-1">Animal</label>
            <select
              name="animal_id"
              value={form.animal_id}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            >
              <option value="">Selecciona un animal</option>
              {animales.map(animal => (
                <option key={animal.id} value={animal.id}>
                  #{animal.numero_identificacion} {animal.nombre ? `— ${animal.nombre}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-1">Vacuna o tratamiento</label>
            <input
              type="text"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              placeholder="Ej: Fiebre aftosa"
              required
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-500 mb-1">Fecha aplicada</label>
              <input
                type="date"
                name="fecha_aplicada"
                value={form.fecha_aplicada}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-1">Próxima dosis (opcional)</label>
              <input
                type="date"
                name="proxima_fecha"
                value={form.proxima_fecha}
                onChange={handleChange}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-1">Aplicada por (opcional)</label>
            <input
              type="text"
              name="aplicada_por"
              value={form.aplicada_por}
              onChange={handleChange}
              placeholder="Ej: Dr. Méndez"
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

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
              onClick={() => navigate('/vacunas')}
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