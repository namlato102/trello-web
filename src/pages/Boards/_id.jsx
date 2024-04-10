import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mockData'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // use react-router-dom to get the board id
    const boardId = '660abc0ca0f6a402d723bfdc'
    // call api to get board details
    fetchBoardDetailsAPI(boardId).then((boardDetail) => {
      // generate placeholder card for each column if existed column has no card
      boardDetail.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })
      // console.log(boardDetail)
      setBoard(boardDetail)
    })
  }, [])

  // call api to create new column and refresh board state
  const createNewColumn = async (newColumnData) => {
    // call api to create new column
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
    // call api to create new column
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

  // call api to move columns and refresh board state
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
        />
      </Container>
    </>
  )
}

export default Board