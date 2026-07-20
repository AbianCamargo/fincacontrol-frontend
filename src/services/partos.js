import api from './api'

// Funciones para interactuar con el endpoint de partos
export const partosService = {
  listar: () => api.get('/partos'),
  crear: (datos) => api.post('/partos', datos),
  actualizar: (id, datos) => api.put(`/partos/${id}`, datos),
  eliminar: (id) => api.delete(`/partos/${id}`),
  registrarCria: (id, datos) => api.post(`/partos/${id}/registrar-cria`, datos),
}