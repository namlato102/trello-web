import Container from '@mui/material/Container'

import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mockData'

function Board() {
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        {/* App Bar */}
        <AppBar />

        {/* Board Bar */}
        <BoardBar board={mockData?.board} />

        {/* Board Content */}
        <BoardContent board={mockData?.board} />
      </Container>
    </>
  )
}

export default Board