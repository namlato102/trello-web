import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as trelloLogo } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'

function AppBar() {
  return (
    <Box px={1} sx={{
      width: '100%', height: (theme) => theme.trello.appBarHeight,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
        {/* appMenu */}
        <AppsIcon sx={{ color: 'primary.main' }}/>

        {/* MyTrelloLogo */}
        <Box sx={{ display:'flex', alignItems:'center', gap: 0.5 }}>
          <SvgIcon component={trelloLogo} inheritViewBox sx={{ color: 'primary.main' }}/>
          <Typography variant="span" sx={{ fontSize:'1.2rem', fontWeight: 'bold', color: 'primary.main' }}>MyTrello</Typography>
        </Box>

        {/* Workspaces */}
        <Workspaces />

        {/* Recent */}
        <Recent />

        {/* Starred */}
        <Starred />

        {/* Templates */}
        <Templates />

        {/* Create */}
        <Button variant="outlined">Create</Button>
      </Box>

      <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
        {/* Searchbar */}
        <TextField id="outlined-search" label="Search..." type="search" size='small'/>

        {/* ModeToggle */}
        <ModeSelect />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <Badge color="secondary" variant="dot" sx={{ cursor:'pointer' }}>
            <NotificationsNoneIcon />
          </Badge>
        </Tooltip>

        {/* Help */}
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor:'pointer' }}/>
        </Tooltip>

        {/* Profiles */}
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar