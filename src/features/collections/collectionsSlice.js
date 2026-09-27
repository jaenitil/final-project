import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchCollections } from '../../api/collectionsApi'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

export const loadCollections = createAsyncThunk(
  'collections/load',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCollections()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCollections.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadCollections.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.items || action.payload?.data || []
      })
      .addCase(loadCollections.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default collectionsSlice.reducer
