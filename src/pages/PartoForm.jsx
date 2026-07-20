import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { partosService } from '../services/partos'
import { animalesService } from '../services/animales'

export default function PartoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const esEdicion = Boolean(id)

  const [vacas, setVacas] = useState([])
  const [form, setForm] = useState({
    madre_id: '',
    fecha_parto: '',
    resultado: 'vivo',
    observaciones: '',
    queda_en_hato: false,
    sexo_cria: 'ternera',
  })

  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [tieneCria, setTieneCria] = useState(false)
  const [sexoCriaCorreccion, setSexoCriaCorreccion] = useState('ternera')
  const [registrandoCria, setRegistrandoCria] = useState(false)

  // Carga solo las vacas activas para el selector de madre
  useEffect(() => {
    animalesService.listar().then(res => {
      const soloVacas = res.data.filter(a => a.sexo === 'vaca' && a.estado === 'activa')
      setVacas(soloVacas)
    })
  }, [])

// Si es edición, carga los datos del parto existente
  useEffect(() => {
    if (esEdicion) {
      partosService.listar().then(res => {
        const parto = res.data.find(p => p.id === Number(id))
        if (parto) {
          setForm({
            madre_id: parto.madre_id,
            fecha_parto: parto.fecha_parto?.split('T')[0] || '',
            resultado: parto.resultado,
            observaciones: parto.observaciones || '',
            queda_en_hato: false,
            sexo_cria: 'ternera',
          })
          setTieneCria(Boolean(parto.cria_id))
        }
      })
    }
  }, [id, esEdicion])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  // Registra la cría de un parto que no la tenía por error de captura
  const handleRegistrarCria = async () => {
    setError(null)
    setRegistrandoCria(true)

    try {
      await partosService.registrarCria(id, { sexo_cria: sexoCriaCorreccion })
      setTieneCria(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar la cría.')
    } finally {
      setRegistrandoCria(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setGuardando(true)

    try {
      if (esEdicion) {
        await partosService.actualizar(id, form)
      } else {
        await partosService.crear(form)
      }
      navigate('/partos')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el parto.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-lg font-bold text-slate-800">
          {esEdicion ? 'Editar parto' : 'Registrar parto'}
        </h1>
        <p className="text-sm text-slate-400 mb-5">
          {esEdicion ? 'Actualiza los datos del parto' : 'Registra un nuevo parto en el hato'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4 max-w-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg flex flex-col gap-4">

          <div>
            <label className="block text-sm text-slate-500 mb-1">Madre</label>
            <select
              name="madre_id"
              value={form.madre_id}
              onChange={handleChange}
              required
              disabled={esEdicion}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 disabled:text-slate-400"
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
            <label className="block text-sm text-slate-500 mb-1">Fecha de parto</label>
            <input
              type="date"
              name="fecha_parto"
              value={form.fecha_parto}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-1">Resultado</label>
            <select
              name="resultado"
              value={form.resultado}
              onChange={handleChange}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            >
              <option value="vivo">Vivo</option>
              <option value="muerto">Muerto</option>
            </select>
          </div>

          {/* Corrección: permite registrar la cría si por error no se hizo al crear el parto */}
          {esEdicion && form.resultado === 'vivo' && !tieneCria && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col gap-3">
              <p className="text-sm text-slate-700">
                Este parto no tiene una cría registrada. Si la cría quedó en el hato, puedes registrarla ahora.
              </p>

              <div>
                <label className="block text-sm text-slate-500 mb-1">Sexo de la cría</label>
                <select
                  value={sexoCriaCorreccion}
                  onChange={e => setSexoCriaCorreccion(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                >
                  <option value="ternera">Ternera</option>
                  <option value="ternero">Ternero</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleRegistrarCria}
                disabled={registrandoCria}
                className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60 self-start"
              >
                {registrandoCria ? 'Registrando...' : 'Registrar cría'}
              </button>
            </div>
          )}

          {esEdicion && tieneCria && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
              ✓ Este parto ya tiene una cría registrada en el hato.
            </div>
          )}

          {/* Solo se muestra al crear, no al editar */}
          {!esEdicion && form.resultado === 'vivo' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="queda_en_hato"
                  checked={form.queda_en_hato}
                  onChange={handleChange}
                />
                La cría se queda en el hato
              </label>

              {form.queda_en_hato && (
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Sexo de la cría</label>
                  <select
                    name="sexo_cria"
                    value={form.sexo_cria}
                    onChange={handleChange}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  >
                    <option value="ternera">Ternera</option>
                    <option value="ternero">Ternero</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-1">
                    El número de identificación se generará automáticamente.
                  </p>
                </div>
              )}
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
              onClick={() => navigate('/partos')}
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