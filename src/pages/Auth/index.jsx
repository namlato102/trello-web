// Authentication - Login and Register
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import InputAdornment from '@mui/material/InputAdornment'
import { useState } from 'react'

function Auth() {
  const [userNameValue, setUserNameValue] = useState()
  const [passwordValue, setPasswordValue] = useState()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        bgcolor: '#1976d2'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          m:'auto',
          borderRadius: '6px',
          width: 'fit-content',
          height: 'fit-content',
          p: 2,
          gap: 2,
          bgcolor: '#ffffff3d',
          flexDirection: 'column'
        }}
      >
        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          value={userNameValue}
          onChange={(e) => setUserNameValue(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CloseIcon
                  fontSize="small"
                  sx={{ color: userNameValue ? 'white' : 'transparent', cursor: 'pointer' }}
                  onClick={() => setUserNameValue('')}
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '300px',
            maxWidth: '300px',
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
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CloseIcon
                  fontSize="small"
                  sx={{ color: passwordValue ? 'white' : 'transparent', cursor: 'pointer' }}
                  onClick={() => setPasswordValue('')}
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '300px',
            maxWidth: '300px',
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
          >Log In</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Auth