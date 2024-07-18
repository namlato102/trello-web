import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'

// Component show user group of a card
function CardUserGroup({ cardMemberIds = [], onUpdateCardMembers }) {
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

  // Lấy activeBoard từ redux ra để lấy được toàn bộ thông tin những thành viên của cái board thông qua field: FE_allUsers
  const board = useSelector(selectCurrentActiveBoard)

  /**
   * Thành viên trong card sẽ phải là tập con của thành viên trong board
   * Vì thế dựa vào mảng board.FE_allUsers và card.memberIds rồi tạo ra một mảng FE_CardMembers
   * chứa đủ thông tin của User để hiển thị ra ngoài giao diện, bởi mặc định trong card chỉ lưu memberIds của User thôi
   */
  const FE_CardMembers = cardMemberIds.map(id => board.FE_allUsers.find(u => u._id === id))
  // console.log('FE_CardMembers:', FE_CardMembers)

  const handleUpdateCardMembers = (user) => {
    // console.log('user:', user)
    const incomingMemberInfo = {
      userId: user._id,
      action: cardMemberIds.includes(user._id) ? CARD_MEMBER_ACTIONS.REMOVE : CARD_MEMBER_ACTIONS.ADD
    }
    // console.log('incomingMemberInfo:', incomingMemberInfo)
    onUpdateCardMembers(incomingMemberInfo)
  }

  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {FE_CardMembers.map(user =>
        <Tooltip title={user.displayName} key={user._id}>
          <Avatar
            sx={{ width: 32, height: 32, cursor: 'pointer' }}
            alt={user.displayName}
            src={user?.avatar}
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
          {board.FE_allUsers.map(user =>
            <Tooltip title={user.displayName} key={user._id}>
              {/* https://mui.com/material-ui/react-avatar/#with-badge */}
              <Badge
                sx={{ cursor: 'pointer' }}
                overlap="rectangular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  cardMemberIds.includes(user._id)
                    ? <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />
                    : null
                }
                onClick={() => handleUpdateCardMembers(user)}
              >
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  alt={user.displayName}
                  src={user?.avatar}
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