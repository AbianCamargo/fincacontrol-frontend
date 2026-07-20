import api from './api'

// Funciones para interactuar con el endpoint de vacunas
export const vacunasService = {
  listar: () => api.get('/vacunas'),
  proximas: () => api.get('/vacunas/proximas'),
  vencidas: () => api.get('/vacunas/vencidas'),
  crear: (datos) => api.post('/vacunas', datos),
  actualizar: (id, datos) => api.put(`/vacunas/${id}`, datos),
  eliminar: (id) => api.delete(`/vacunas/${id}`),
}