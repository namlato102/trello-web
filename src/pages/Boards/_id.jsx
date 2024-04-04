import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mockData'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // use react-router-dom to get the board id
    const boardId = '660abc0ca0f6a402d723bfdc'
    // call api to get board details
    fetchBoardDetailsAPI(boardId).then((boardDetail) => {
      setBoard(boardDetail)
    })
  }, [])

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
        <BoardContent board={board} />
      </Container>
    </>
  )
}

export default Board