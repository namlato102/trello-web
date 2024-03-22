import Box from '@mui/material/Box'
import Cards from './Card/Cards'

function ListCards() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      p: '0 5px',
      m: '0 5px',
      gap: 1,
      overflowX: 'hidden',
      overflowY: 'auto',
      maxHeight: (theme) => `calc(
        ${theme.trello.boardContentHeight} -
        ${theme.spacing(5)} -
        ${theme.trello.columnHeaderHeight} -
        ${theme.trello.columnFooterHeight}
      )`,
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#ced0da'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#bfc2cf'
      }
    }}>
      {/* Cards */}
      <Cards />
      <Cards temporaryHideMedia/>
      <Cards temporaryHideMedia/>
      <Cards temporaryHideMedia/>
      <Cards temporaryHideMedia/>
      <Cards temporaryHideMedia/>
      <Cards temporaryHideMedia/>
      <Cards temporaryHideMedia/>
      <Cards temporaryHideMedia/>
      <Cards temporaryHideMedia/>
      <Cards temporaryHideMedia/>
    </Box>
  )
}

export default ListCards