import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { showModalActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

function Card({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card._id,
    data: { ...card }
  })
  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #3498db' : undefined
  }
  const dispatch = useDispatch()

  /**
   * Determines whether to show card actions based on the presence of memberIds, comments, or attachments.
   * @returns {boolean} True if any of the card actions should be shown, false otherwise.
   */
  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  // Function set current active card and show modal edit card
  const setActiveCard = () => {
    dispatch(updateCurrentActiveCard(card))
    dispatch(showModalActiveCard())
  }

  return (
    <MuiCard
      onClick={setActiveCard}
      ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}
      sx={{
        cursor: 'pointer',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
      }}
    >
      {card?.cover && <CardMedia
        sx={{ height: 140 }}
        image={card.cover}
      />}

      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>

      {shouldShowCardActions() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length &&
            <Button startIcon= {<GroupIcon />} size="small">{card?.memberIds?.length}</Button>
          }
          {!!card?.comments?.length &&
            <Button startIcon= {<CommentIcon />} size="small">{card?.comments?.length}</Button>
          }
          {!!card?.attachments?.length &&
            <Button startIcon= {<AttachmentIcon />} size="small">{card?.attachments?.length}</Button>
          }
        </CardActions>
      }
    </MuiCard>
  )
}

export default Card