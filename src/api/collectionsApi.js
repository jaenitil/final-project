
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchCollections({ page = 1, pageSize = 50 } = {}) {
  const url = new URL(`${BASE_URL}/manufactures`)
  url.searchParams.set('page', page)
  url.searchParams.set('page_size', pageSize)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити колекції (код ${response.status})`)
  }
  return response.json()
}

export async function fetchCollectionById(id) {
  const response = await fetch(`${BASE_URL}/manufactures/${id}`)
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити колекцію (код ${response.status})`)
  }
  return response.json()
}
