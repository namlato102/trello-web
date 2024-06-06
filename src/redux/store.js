// Redux: State management tool
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'

import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

/**
 * Config redux-persist
 * https://www.npmjs.com/package/redux-persist
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 * key is defined by you, default is root
 * default là localStorage
 */

// Config persist
const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user']
  // blacklist: ['user']
}

// Combine all reducers in the project
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

// store all reducers in local storage using rootPersistConfig
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers
})