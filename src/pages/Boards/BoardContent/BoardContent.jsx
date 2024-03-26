import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  // PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {
  /**
   * Renders the content of a board.
   * Destructuring assignment:
   * extracting multiple values from data stored in objects or arrays
   *
   * @param {Object} props - The props for the component.
   * @param {Object} props.board - The board object.
   */
  // const { board } = props
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // Require the mouse to move by 10 pixels before activating
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // Press delay of 250ms, with tolerance of 500px of movement
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  const mySensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    // Get the active and over columns
    const { active, over } = event

    // if over is null, return
    if (!over) return

    // if active and over are different columns
    if (active.id !== over.id) {
      // Find the index of the column being dragged
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Find the index of the column being dragged over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      // Move the dragged column to the new index
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      // xu ly du lieu de luu vao db khi goi api
      // const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns', dndOrderedColumns)
      // console.log('dndOrderedColumnIds', dndOrderedColumnIds)

      // update state
      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={mySensors}>

      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent