// Redux: State management tool
import { activeBoardReducer } from './activeBoardSlice/activeBoardSlice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer
  }
})