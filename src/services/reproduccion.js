import api from './api'

// Funciones para interactuar con el endpoint de reproducción
export const reproduccionService = {
  listar: () => api.get('/reproduccion'),
  prenadas: () => api.get('/reproduccion/prenadas'),
  crear: (datos) => api.post('/reproduccion', datos),
  actualizar: (id, datos) => api.put(`/reproduccion/${id}`, datos),
  eliminar: (id) => api.delete(`/reproduccion/${id}`),
}