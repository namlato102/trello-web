import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

function BoardContent(props) {
  /**
   * Renders the content of a board.
   *
   * @param {Object} props - The props for the component.
   * @param {Object} props.board - The board object.
   */
  const { board } = props
  // const board = props.board

  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      width: '100%',
      height: (theme) => theme.trello.boardContentHeight,
      p: '10px 0'
    }}>
      <ListColumns columns={orderedColumns} />
    </Box>
  )
}

export default BoardContent