import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'

// Function display a group of users in a board
// eslint-disable-next-line no-unused-vars
function BoardUserGroup({ boardUsers = [], limit = 8 }) {
  // https://mui.com/material-ui/react-popover/
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {[...Array(16)].map((_, index) => {
        if (index < limit) {
          return (
            <Tooltip title="" key={index}>
              <Avatar
                sx={{ width: 32, height: 32, cursor: 'pointer' }}
                alt=""
                src=""
              />
            </Tooltip>
          )
        }
      })}

      {[...Array(16)].length > limit &&
        <Tooltip title="Show more">
          <Box
            aria-describedby={popoverId}
            onClick={handleTogglePopover}
            sx={{
              width: 32,
              height: 32,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#a4b0be'
            }}
          >
            +{[...Array(16)].length - limit}
          </Box>
        </Tooltip>
      }

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '235px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {[...Array(16)].map((_, index) =>
            <Tooltip title="" key={index}>
              <Avatar
                sx={{ width: 32, height: 32, cursor: 'pointer' }}
                alt=""
                src=""
              />
            </Tooltip>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default BoardUserGroup