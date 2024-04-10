import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mockData'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // use react-router-dom to get the board id
    const boardId = '660abc0ca0f6a402d723bfdc'
    // call api to get board details
    fetchBoardDetailsAPI(boardId).then((boardDetail) => {
      // sort columns and cards by columnOrderIds before set state
      boardDetail.columns = mapOrder(boardDetail.columns, boardDetail.columnOrderIds, '_id')

      // generate placeholder card for each column if existed column has no card
      boardDetail.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // sort cards by cardOrderIds
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      // console.log(boardDetail)
      setBoard(boardDetail)
    })
  }, [])

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
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // call api to create new card and refresh board state
  const createNewCard = async (newCardData) => {
    // call and wait for api to create new card
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    // then refresh board state from useState() instead call api again (by reload page)
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  // call api to update columnOrderIds when moving column
  const moveColumns = (dndOrderedColumns) => {
    // update state for columnOrderIds
    const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)

    // call api to update columnOrderIds
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  // call api to update cardOrderIds when moving card in the same column
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // update state board for cardOrderIds
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    setBoard(newBoard)

    // call api to update cardOrderIds
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
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
        />
      </Container>
    </>
  )
}

export default Board