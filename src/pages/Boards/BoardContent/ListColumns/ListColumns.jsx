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
import { createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { cloneDeep } from 'lodash'

function ListColumns({ columns }) {
  const [openNewColumn, setOpenNewColumn] = useState(false)
  const toggleOpenNewColumn = () => setOpenNewColumn(!openNewColumn)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  // use selector to get board from redux and dispatch to call action instead of react useState
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()

  // call api to create new column and refresh board state
  const createNewColumn = async (newColumnData) => {
    // use redux global store to store board state instead of call props function
    // call and wait for api to create new column
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // generate placeholder card when create new column
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // then refresh board state from useState() instead call api again (by reload page)
    /**
      * Đoạn này khi chỉnh sửa giá trị lấy từ redux ngoài component sẽ dính lỗi object is not extensible
      * bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất của spread operator là Shallow Copy/Clone,
      * nên dính phải rules Immutability trong Redux Toolkit không dùng được hàm PUSH (sửa giá trị mảng trực tiếp),
      * => dùng Deep Copy/Clone toàn bộ cái Board.
      * https://redux-toolkit.js.org/usage/immer-reducers
      * Tài liệu thêm về Shallow và Deep Copy Object trong JS:
      * https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
      */
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    dispatch(updateCurrentActiveBoard(newBoard))
  }

  // react hook form
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title')
      return
    }

    // create new column data to send to API
    const newColumnData = {
      title: newColumnTitle
    }

    createNewColumn(newColumnData)

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
          return (<Column key={column._id} column={column}/>)
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