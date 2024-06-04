// Redux: State management tool
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'

export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer,
    user: userReducer
  }
})