// import { createTheme } from '@mui/material/styles'
// import { red } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

// Create a theme instance.
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#000'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#FFFFFF'
        }
      }
    }
  }
})

export default theme