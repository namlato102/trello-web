import Box from '@mui/material/Box'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import InputAdornment from '@mui/material/InputAdornment'

function ListColumns({ columns, createNewColumn, createNewCard }) {
  const [openNewColumn, setOpenNewColumn] = useState(false)
  const toggleOpenNewColumn = () => setOpenNewColumn(!openNewColumn)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  // react hook form
  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title')
      return
    }

    // create new column data to send to API
    const newColumnData = {
      title: newColumnTitle
    }

    // call function props createNewColumn from boards/_id.jsx
    // use redux global store to store board state instead of local state
    createNewColumn(newColumnData)

    // console.log('Add new column with title:', newColumnTitle)
    // close state and clear input
    toggleOpenNewColumn()
    setNewColumnTitle('')
  }

  return (
    // Y responsive scrollbar
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': {
          m: 2
        }
      }}>
        {columns?.map((column) => {
          return (<Column key={column._id} column={column} createNewCard={createNewCard} />)
        })}

        {/* Button Add new Column */}
        {!openNewColumn ?
          <Box onClick={toggleOpenNewColumn} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
              startIcon={<NoteAddIcon />}>Add new Column</Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label="Enter column title..."
              type="text"
              size='small'
              varient='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CloseIcon
                      fontSize="small"
                      sx={{
                        color: 'white',
                        cursor: 'pointer',
                        '&:hover': { color: '#e37f7f' }
                      }}
                      onClick={toggleOpenNewColumn}
                    />
                  </InputAdornment>
                )
              }}
              sx={{
                '& label': {
                  color: 'white'
                },
                '& input': {
                  color: 'white'
                },
                '& label.Mui-focused': {
                  color: 'white'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant='contained'
                color='success'
                size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.success.main
                  }
                }}
              >Add Column</Button>
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns