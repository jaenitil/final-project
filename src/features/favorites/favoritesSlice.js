import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchFavorites, addFavorite, removeFavorite } from '../../api/favoritesApi'

const initialState = {
  items: [],
  ids: [],
  status: 'idle',
  error: null,
}

export const loadFavorites = createAsyncThunk(
  'favorites/load',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchFavorites()
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const toggleFavorite = createAsyncThunk(
  'favorites/toggle',
  async (pieceId, { getState, rejectWithValue }) => {
    try {
      const isFavorite = getState().favorites.ids.includes(pieceId)
      if (isFavorite) {
        await removeFavorite(pieceId)
        return { pieceId, action: 'removed' }
      } else {
        await addFavorite(pieceId)
        return { pieceId, action: 'added' }
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const list = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.items || action.payload?.data || []
        state.items = list
        state.ids = list.map((item) => item.id ?? item.carId)
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { pieceId, action: type } = action.payload
        if (type === 'added') {
          state.ids.push(pieceId)
        } else {
          state.ids = state.ids.filter((id) => id !== pieceId)
          state.items = state.items.filter((item) => (item.id ?? item.carId) !== pieceId)
        }
      })
  },
})

export default favoritesSlice.reducer
