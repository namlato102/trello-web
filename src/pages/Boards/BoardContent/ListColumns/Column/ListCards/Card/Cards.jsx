import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

function Cards({ temporaryHideMedia }) {
  if (temporaryHideMedia) {
    return (
      <Card sx={{
        cursor: 'pointer',
        overflow: 'unset'
      }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>Card test 01</Typography>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card sx={{
      cursor: 'pointer',
      overflow: 'unset'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image="./working.jpg"
        title="green iguana"
      />
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>Card 01</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button startIcon= {<GroupIcon />} size="small">20</Button>
        <Button startIcon= {<CommentIcon />} size="small">15</Button>
        <Button startIcon= {<AttachmentIcon />} size="small">10</Button>
      </CardActions>
    </Card>
  )
}

export default Cards