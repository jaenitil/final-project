import api from './axiosInstance'

export async function updateProfile({ userId, userName, country, birthDate, aboutMe }) {
  const { data } = await api.patch('/user/profile', {
    userId,
    userName,
    country,
    birthDate,
    aboutMe,
  })
  return data
}

export async function changePassword({ oldPassword, newPassword }) {
  const { data } = await api.patch('/user/changePassword', { oldPassword, newPassword })
  return data
}

export async function changeEmail({ email, callbackUrl }) {
  const { data } = await api.post(
    '/user/changeEmail',
    { email },
    { params: callbackUrl ? { callbackUrl } : {} }
  )
  return data
}
