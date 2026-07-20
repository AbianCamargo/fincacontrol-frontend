import api from './api'

// Funciones para interactuar con el endpoint de animales
export const animalesService = {
  listar: () => api.get('/animales'),
  obtener: (id) => api.get(`/animales/${id}`),
  crear: (datos) => api.post('/animales', datos),
  actualizar: (id, datos) => api.put(`/animales/${id}`, datos),
  eliminar: (id) => api.delete(`/animales/${id}`),
}