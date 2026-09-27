import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  registerRequest,
  loginRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
} from '../../api/authApi'

const savedToken = localStorage.getItem('oprava_token')
const savedUser = localStorage.getItem('oprava_user')

const initialState = {
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
  status: 'idle', 
  error: null,
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      return await registerRequest(payload)
    } catch (err) {
      return rejectWithValue(err.response?.data?.title || err.response?.data || err.message)
    }
  }
)

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { token, user } = await loginRequest(payload)
    if (!token) {
      throw new Error('Сервер не повернув токен авторизації')
    }
    localStorage.setItem('oprava_token', token)
    if (user) localStorage.setItem('oprava_user', JSON.stringify(user))
    return { token, user }
  } catch (err) {
    return rejectWithValue(err.response?.data?.title || err.response?.data || err.message)
  }
})

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload, { rejectWithValue }) => {
    try {
      return await forgotPasswordRequest(payload)
    } catch (err) {
      return rejectWithValue(err.response?.data?.title || err.response?.data || err.message)
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      return await resetPasswordRequest(payload)
    } catch (err) {
      return rejectWithValue(err.response?.data?.title || err.response?.data || err.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      state.status = 'idle'
      localStorage.removeItem('oprava_token')
      localStorage.removeItem('oprava_user')
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Не вдалося увійти'
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Не вдалося зареєструватися'
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload || 'Не вдалося надіслати лист'
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload || 'Не вдалося скинути пароль'
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
