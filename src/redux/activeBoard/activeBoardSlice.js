import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_URL } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

// create initial state for activeBoardSlice
const initialState = {
  currentActiveBoard: null
}

/**
 * activeBoardslice as reducer in redux store:
 * @param name: name of slice in redux store
 * @param initialState: initial state of slice
 * @param reducers: handle logic update state in redux, use for sync actions
 * @param extraReducers: handle logic update state in redux, use for async actions
 */
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: handle logic update state in redux, use for sync actions
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // get data from component dispatch action as action.payload (caution: object data is handle outside of redux)
      const board = action.payload

      // Update currentActiveBoard
      state.currentActiveBoard = board
    },

    updateCardInBoard: (state, action) => {
      // Update nested data
      // https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incomingCard = action.payload

      // Tìm dần cái card cần update từ board > column > card
      const column = state.currentActiveBoard.columns.find(i => i._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(i => i._id === incomingCard._id)
        if (card) {
          // Update card
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },
  // extraReducer: handle logic update state in redux, use for async actions
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // get response data from createAsyncThunk action as action.payload
      const board = action.payload

      // sort columns and cards by columnOrderIds before set state
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      // generate placeholder card for each column if existed column has no card
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // sort cards by cardOrderIds
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      // Update currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

/**
 * Action creators are generated for each case reducer function
 * action's name is auto generated by redux with name of reducers
 */
// sync actions: use dispatch to update state in redux via reducers
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

// async actions: call api to update state in redux, use Middleware createAsyncThunk via extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_URL}/v1/boards/${boardId}`)
    // axios return data in response.data
    return response.data
  }
)

/**
 * Selectors:
 * selectCurrentActiveBoard(): get currentActiveBoard state from redux store
 * @param state: state of redux store
 * @returns currentActiveBoard from redux store
 * use useSelector() to get state currentActiveBoard from redux store
 */
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// store activeBoardSlice.reducer as default reducer of activeBoardSlice under key "(name)activeBoard" in redux store
export const activeBoardReducer = activeBoardSlice.reducer