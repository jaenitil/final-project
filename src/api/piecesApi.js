import api from './axiosInstance'



export async function fetchPieces({ page = 1, pageSize = 12 } = {}) {
  const { data } = await api.get('/cars', {
    params: { page, page_size: pageSize },
  })
  return data
}

export async function fetchPieceById(id) {
  const { data } = await api.get(`/cars/${id}`)
  return data
}

export async function fetchPiecesByPrice({ minValue, maxValue, page = 1, pageSize = 12 } = {}) {
  const { data } = await api.get('/cars/by-price', {
    params: { minValue, maxValue, page, page_size: pageSize },
  })
  return data
}

export async function fetchPiecesByProperty({ property, value, page = 1, pageSize = 12 } = {}) {
  const { data } = await api.get('/cars', {
    params: { property, value, page, page_size: pageSize },
  })
  return data
}

export async function createPiece(payload) {
  const { data } = await api.post('/cars', payload)
  return data
}

export async function updatePiece(payload) {
  const { data } = await api.put('/cars', payload)
  return data
}

export async function deletePiece(id) {
  const { data } = await api.delete(`/cars/${id}`)
  return data
}
