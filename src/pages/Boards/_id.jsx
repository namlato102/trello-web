import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mockData'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'

function Board() {
  // use selector to get board from redux and dispatch to call action instead of react useState
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const { boardId } = useParams()

  useEffect(() => {
    // use react-router-dom to get the board id
    // const boardId = '660abc0ca0f6a402d723bfdc'
    // call api to get board details from redux
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // call api to update columnOrderIds when moving column
  const moveColumns = (dndOrderedColumns) => {
    // update state for columnOrderIds
    const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds

    dispatch(updateCurrentActiveBoard(newBoard))

    // call api to update columnOrderIds
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  // call api to update cardOrderIds when moving card in the same column
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // update state board for cardOrderIds
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }

    dispatch(updateCurrentActiveBoard(newBoard))

    // call api to update cardOrderIds
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
  }

  // update cardOrderIds of old column and new column when moving card to different column by delete card
  // update cardOrderIds of new column by add card
  // update columnId of dragged card
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // update state for columnOrderIds
    const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds

    dispatch(updateCurrentActiveBoard(newBoard))

    // if column (where the last card got dragged from) has placeholder card, set cardOrderIds of column to empty array before call api
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) {
      prevCardOrderIds = []
    }

    // call api to update cardOrderIds of old column and new column
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />
  }

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        {/* Modal Active Card, check đóng/mở dựa theo cái State isShowModalActiveCard lưu trong Redux */}
        <ActiveCard />

        {/* App Bar */}
        <AppBar />

        {/* Board Bar */}
        {/* <BoardBar board={mockData?.board} /> */}
        <BoardBar board={board} />

        {/* Board Content */}
        {/* <BoardContent board={mockData?.board} /> */}
        <BoardContent
          board={board}
          /**
           * keep these 3 functions as is to handle drag and drop in BoardContent,
           * don't move them to BoardContent to keep the code clean and maintainable.
           */
          moveColumns={moveColumns}
          moveCardInTheSameColumn={moveCardInTheSameColumn}
          moveCardToDifferentColumn={moveCardToDifferentColumn}
        />
      </Container>
    </>
  )
}

export default Board