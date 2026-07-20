import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { animalesService } from '../services/animales'

export default function Animales() {
  const [animales, setAnimales] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    animalesService.listar()
      .then(res => setAnimales(res.data))
      .finally(() => setCargando(false))
  }, [])

  // Filtra animales por número de identificación o nombre
  const animalesFiltrados = animales.filter(animal =>
    animal.numero_identificacion.toLowerCase().includes(busqueda.toLowerCase()) ||
    animal.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Animales</h1>
            <p className="text-sm text-slate-400">{animales.length} animales registrados en el hato</p>
          </div>
          <Link
            to="/animales/nuevo"
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Nuevo animal
          </Link>
        </div>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por número o nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full h-10 px-3 mb-4 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
        />

        {/* Tabla */}
        {cargando ? (
          <p className="text-sm text-slate-400">Cargando...</p>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">N° ID</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Nombre</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Sexo</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Raza</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Estado</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500 text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {animalesFiltrados.map(animal => (
                  <tr key={animal.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2">
                      <Link to={`/animales/${animal.id}`} className="font-semibold text-blue-700 hover:underline">
                        #{animal.numero_identificacion}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-slate-600">{animal.nombre || '—'}</td>
                    <td className="px-4 py-2">
                      <BadgeSexo sexo={animal.sexo} />
                    </td>
                    <td className="px-4 py-2 text-slate-600">{animal.raza || '—'}</td>
                    <td className="px-4 py-2">
                    <BadgeEstado estado={animal.estado} />
                    </td>
                    <td className="px-4 py-2">
                    <Link
                        to={`/animales/${animal.id}/editar`}
                        className="text-xs text-slate-500 hover:text-blue-700 font-semibold"
                    >
                        Editar
                    </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {animalesFiltrados.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No se encontraron animales.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

// Etiqueta de color según el sexo del animal
function BadgeSexo({ sexo }) {
  const estilos = {
    vaca: 'bg-blue-100 text-blue-700',
    toro: 'bg-purple-100 text-purple-700',
    ternero: 'bg-slate-100 text-slate-600',
    ternera: 'bg-slate-100 text-slate-600',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${estilos[sexo]}`}>
      {sexo}
    </span>
  )
}

// Etiqueta de color según el estado del animal
function BadgeEstado({ estado }) {
  const estilos = {
    activa: 'bg-green-100 text-green-700',
    vendida: 'bg-amber-100 text-amber-700',
    muerta: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${estilos[estado]}`}>
      {estado}
    </span>
  )
}