import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Component show user group of a card
// eslint-disable-next-line no-unused-vars
function CardUserGroup({ cardMemberIds = [] }) {
  /**
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {[...Array(8)].map((_, index) =>
        <Tooltip title="" key={index}>
          <Avatar
            sx={{ width: 32, height: 32, cursor: 'pointer' }}
            alt=""
            src=""
          />
        </Tooltip>
      )}

      {/* Nút này để mở popover thêm member */}
      <Tooltip title="Add new member">
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
            fontWeight: '600',
            borderRadius: '50%',
            color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200],
            '&:hover': {
              color: (theme) => theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
            }
          }}
        >
          <AddIcon fontSize="small" />
        </Box>
      </Tooltip>

      {/* Khi Click vào + ở trên thì sẽ mở popover hiện toàn bộ users trong board để người dùng Click chọn thêm vào card  */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '260px', display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {[...Array(16)].map((_, index) =>
            <Tooltip title="" key={index}>
              {/* https://mui.com/material-ui/react-avatar/#with-badge */}
              <Badge
                sx={{ cursor: 'pointer' }}
                overlap="rectangular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={<CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />}
              >
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  alt=""
                  src=""
                />
              </Badge>
            </Tooltip>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default CardUserGroup