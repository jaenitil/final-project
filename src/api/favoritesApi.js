import api from './axiosInstance'

export async function fetchFavorites() {
  const { data } = await api.get('/user/favorite-cars')
  return data
}

export async function addFavorite(carId) {
  const { data } = await api.post(`/user/favorite-cars/${carId}`)
  return data
}

export async function removeFavorite(carId) {
  const { data } = await api.delete(`/user/favorite-cars/${carId}`)
  return data
}
