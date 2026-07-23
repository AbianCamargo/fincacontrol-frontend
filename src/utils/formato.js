// Convierte una fecha en formato ISO (2026-04-14) a formato legible (14/04/2026)
export function formatearFecha(fecha) {
  if (!fecha) return '—'

  const soloFecha = fecha.split('T')[0]
  const [anio, mes, dia] = soloFecha.split('-')

  return `${dia}/${mes}/${anio}`
}