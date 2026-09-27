import api from './axiosInstance'

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

export async function registerRequest({ username, email, password, firstName, lastName, image }) {
  const { data } = await api.post('/auth/register', {
    username,
    email,
    password,
    firstName,
    lastName,
    image: image || 'https://placehold.co/200x200/ece5d6/6e5228?text=User',
  })
  return data
}

export async function loginRequest({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password })

  if (!data?.success || !data?.payload) {
    throw new Error(data?.message || 'Не вдалося увійти')
  }

  const token = data.payload
  const user = decodeJwt(token) 

  return { token, user, raw: data }
}

export async function forgotPasswordRequest({ email, callbackUrl }) {
  const { data } = await api.post(
    '/auth/forgotPassword',
    { email },
    { params: callbackUrl ? { callbackUrl } : {} }
  )
  return data
}

export async function resetPasswordRequest({ userId, token, newPassword }) {
  const { data } = await api.post('/auth/resetPassword', { userId, token, newPassword })
  return data
}

export async function fetchCurrentUser(token) {
  const { data } = await api.post('/auth/me', JSON.stringify(token), {
    headers: { 'Content-Type': 'application/json' },
  })
  return data
}
