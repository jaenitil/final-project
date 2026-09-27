import { useDispatch, useSelector } from 'react-redux'
import { logout as logoutAction } from '../features/auth/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const { token, user, status, error } = useSelector((state) => state.auth)

  return {
    token,
    user,
    status,
    error,
    isAuthenticated: Boolean(token),
    logout: () => dispatch(logoutAction()),
  }
}
