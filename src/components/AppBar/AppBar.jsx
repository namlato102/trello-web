import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as trelloLogo } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
// import Workspaces from './Menus/Workspaces'
// import Recent from './Menus/Recent'
// import Starred from './Menus/Starred'
// import Templates from './Menus/Templates'
// import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
// import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'

function AppBar() {
  return (
    <Box px={1} sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
        {/* appMenu */}
        <Link to="/">
          <AppsIcon sx={{ color: 'white' }}/>
        </Link>

        {/* MyTrelloLogo */}
        <Link to="/">
          <Box sx={{ display:'flex', alignItems:'center', gap: 0.5 }}>
            <SvgIcon component={trelloLogo} fontSize='small' inheritViewBox sx={{ color: 'white' }}/>
            <Typography variant="span" sx={{ fontSize:'1.2rem', fontWeight: 'bold', color: 'white' }}>MyTrello</Typography>
          </Box>
        </Link>

        <Box sx={{ display: { xs:'none', md: 'flex' } }}>
          {/* Workspaces */}
          {/* <Workspaces /> */}

          {/* Recent */}
          {/* <Recent /> */}

          {/* Starred */}
          {/* <Starred /> */}

          {/* Templates */}
          {/* <Templates /> */}

          {/* Create */}
          {/* <Button
            sx={{
              color: 'white',
              border: 'none',
              '&:hover': {
                border: 'none'
              }
            }}
            variant="outlined"
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button> */}
        </Box>
      </Box>
      <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
        {/* SearchBoardBar */}
        <AutoCompleteSearchBoard />

        {/* ModeToggle */}
        <ModeSelect />

        {/* Notifications */}
        <Notifications />

        {/* Help */}
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor:'pointer', color: 'white' }}/>
        </Tooltip>

        {/* Profiles */}
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar