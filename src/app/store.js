import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import favoritesReducer from '../features/favorites/favoritesSlice'
import piecesReducer from '../features/pieces/piecesSlice'
import collectionsReducer from '../features/collections/collectionsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    pieces: piecesReducer,
    collections: collectionsReducer,
  },
})
