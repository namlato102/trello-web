import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { fetchBoardsAPI } from '~/apis'
import { useDebounceFn } from '~/customHooks/useDebounceFn'

/**
 * https://mui.com/material-ui/react-autocomplete/#asynchronous-requests
 */
function AutoCompleteSearchBoard() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [boards, setBoards] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Khi đóng cái phần list kết quả lại thì đồng thời clear cho boards về null
    if (!open) { setBoards(null) }
  }, [open])

  // Xử lý việc nhận data nhập vào từ input sau đó gọi API để lấy kết quả về
  const handleInputSearchChange = (event) => {
    const searchValue = event.target?.value
    if (!searchValue) return
    // console.log(searchValue)

    // Dùng createSearchParams của react-router-dom để tạo một cái searchPath chuẩn với q[title] để gọi lên API
    const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`
    // console.log(searchPath)

    // Gọi API...
    setLoading(true)
    fetchBoardsAPI(searchPath)
      .then(res => {
        setBoards(res.boards || [])
      })
      .finally(() => {
        // Lưu ý về việc setLoading về false luôn phải chạy trong finally để dù có lỗi hay không thì cũng không hiện cái loading nữa
        setLoading(false)
      })
  }
  // Bọc hàm handleInputSearchChange ở trên vào useDebounceFn và cho delay khoảng 1s sau khi dừng gõ phím thì mới chạy cái function
  const debounceSearchBoard = useDebounceFn(handleInputSearchChange, 1000)

  // Khi select một cái board cụ thể thì sẽ điều hướng tới board đó luôn
  const handleSelectedBoard = (event, selectedBoard) => {
    // console.log(selectedBoard)
    if (selectedBoard) {
      navigate(`/boards/${selectedBoard._id}`)
    }
  }

  return (
    <Autocomplete
      sx={{ width: 220 }}
      id="asynchronous-search-board"
      noOptionsText={!boards ? 'Type to search board...' : 'No board found!'}
      open={open}
      onOpen={() => { setOpen(true) }}
      onClose={() => { setOpen(false) }}
      getOptionLabel={(board) => board.title}
      options={boards || []}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      loading={loading}
      onInputChange={debounceSearchBoard}
      onChange={handleSelectedBoard}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Type to search..."
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          sx={{
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            },
            '.MuiSvgIcon-root': { color: 'white' }
          }}
        />
      )}
    />
  )
}

export default AutoCompleteSearchBoard