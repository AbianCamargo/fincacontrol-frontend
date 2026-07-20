import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { animalesService } from '../services/animales'

export default function AnimalForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const esEdicion = Boolean(id)

  const [form, setForm] = useState({
    numero_identificacion: '',
    nombre: '',
    fecha_nacimiento: '',
    sexo: 'vaca',
    raza: '',
    estado: 'activa',
  })

  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  // Si es edición, carga los datos del animal existente
  useEffect(() => {
    if (esEdicion) {
      animalesService.obtener(id).then(res => {
        setForm({
          numero_identificacion: res.data.numero_identificacion,
          nombre: res.data.nombre || '',
          fecha_nacimiento: res.data.fecha_nacimiento?.split('T')[0] || '',
          sexo: res.data.sexo,
          raza: res.data.raza || '',
          estado: res.data.estado,
        })
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
        await animalesService.actualizar(id, form)
      } else {
        await animalesService.crear(form)
      }
      navigate('/animales')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el animal.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-lg font-bold text-slate-800">
          {esEdicion ? 'Editar animal' : 'Nuevo animal'}
        </h1>
        <p className="text-sm text-slate-400 mb-5">
          {esEdicion ? 'Actualiza los datos del animal' : 'Registra un nuevo animal en el hato'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4 max-w-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg flex flex-col gap-4">

          <div>
            <label className="block text-sm text-slate-500 mb-1">Número de identificación</label>
            <input
              type="text"
              name="numero_identificacion"
              value={form.numero_identificacion}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-1">Nombre (opcional)</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-500 mb-1">Sexo</label>
              <select
                name="sexo"
                value={form.sexo}
                onChange={handleChange}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
              >
                <option value="vaca">Vaca</option>
                <option value="toro">Toro</option>
                <option value="ternero">Ternero</option>
                <option value="ternera">Ternera</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-1">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
              >
                <option value="activa">Activa</option>
                <option value="vendida">Vendida</option>
                <option value="muerta">Muerta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-1">Raza (opcional)</label>
            <input
              type="text"
              name="raza"
              value={form.raza}
              onChange={handleChange}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
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
              onClick={() => navigate('/animales')}
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