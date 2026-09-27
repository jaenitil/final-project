import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchPieces, fetchPieceById, fetchPiecesByPrice, createPiece } from '../../api/piecesApi'

const initialState = {
  items: [],
  currentPiece: null,
  page: 1,
  pageSize: 100,
  priceRange: { min: '', max: '' },
  status: 'idle',
  detailsStatus: 'idle',
  error: null,
}

export const loadPieces = createAsyncThunk(
  'pieces/load',
  async ({ page, pageSize } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState().pieces
      return await fetchPieces({
        page: page ?? state.page,
        pageSize: pageSize ?? state.pageSize,
      })
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const loadPiecesByPrice = createAsyncThunk(
  'pieces/loadByPrice',
  async ({ minValue, maxValue }, { getState, rejectWithValue }) => {
    try {
      const state = getState().pieces
      return await fetchPiecesByPrice({
        minValue,
        maxValue,
        page: state.page,
        pageSize: state.pageSize,
      })
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const loadPieceDetails = createAsyncThunk(
  'pieces/loadOne',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchPieceById(id)
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const addPiece = createAsyncThunk(
  'pieces/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await createPiece(payload)
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const piecesSlice = createSlice({
  name: 'pieces',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload
    },
    setPriceRange(state, action) {
      state.priceRange = action.payload
    },
    clearCurrentPiece(state) {
      state.currentPiece = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPieces.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadPieces.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.items || action.payload?.data || []
      })
      .addCase(loadPieces.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Не вдалося завантажити каталог'
      })
      .addCase(loadPiecesByPrice.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.items || action.payload?.data || []
      })
      .addCase(loadPieceDetails.pending, (state) => {
        state.detailsStatus = 'loading'
      })
      .addCase(loadPieceDetails.fulfilled, (state, action) => {
        state.detailsStatus = 'succeeded'
        state.currentPiece = action.payload
      })
      .addCase(loadPieceDetails.rejected, (state, action) => {
        state.detailsStatus = 'failed'
        state.error = action.payload || 'Не вдалося завантажити виріб'
      })
  },
})

export const { setPage, setPriceRange, clearCurrentPiece } = piecesSlice.actions
export default piecesSlice.reducer
