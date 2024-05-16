import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mockData'
import {
  createNewColumnAPI,
  createNewCardAPI, updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoardSlice/activeBoardSlice'
import { cloneDeep } from 'lodash'

function Board() {
  // const [board, setBoard] = useState(null)
  // Không dùng State của component nữa mà chuyển qua dùng State của Redux
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()

  useEffect(() => {
    // use react-router-dom to get the board id
    const boardId = '660abc0ca0f6a402d723bfdc'
    // call api to get board details from redux
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch])

  // call api to create new column and refresh board state
  const createNewColumn = async (newColumnData) => {
    // call and wait for api to create new column
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // generate placeholder card when create new column
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // then refresh board state from useState() instead call api again (by reload page)
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
  }

  // call api to create new card and refresh board state
  const createNewCard = async (newCardData) => {
    // call and wait for api to create new card
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    // then refresh board state from useState() instead call api again (by reload page)
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {

      // if column has placeholder card, replace it with new card
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // if column has card, add new card to the end of cards array
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
  }

  // call api to update columnOrderIds when moving column
  const moveColumns = (dndOrderedColumns) => {
    // update state for columnOrderIds
    const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    // setBoard(newBoard)
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
    // setBoard(newBoard)
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
    // setBoard(newBoard)
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

  // delete column and its cards
  const deleteColumnDetails = (columnId) => {
    // update state board
    const newBoard = cloneDeep(board)
    newBoard.columns = newBoard.columns.filter(column => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // call api to delete column
    deleteColumnDetailsAPI(columnId).then(res => {
      // show toast notification from BE response
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap : 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        {/* App Bar */}
        <AppBar />

        {/* Board Bar */}
        {/* <BoardBar board={mockData?.board} /> */}
        <BoardBar board={board} />

        {/* Board Content */}
        {/* <BoardContent board={mockData?.board} /> */}
        <BoardContent
          board={board}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          moveColumns={moveColumns}
          moveCardInTheSameColumn={moveCardInTheSameColumn}
          moveCardToDifferentColumn={moveCardToDifferentColumn}
          deleteColumnDetails={deleteColumnDetails}
        />
      </Container>
    </>
  )
}

export default Board