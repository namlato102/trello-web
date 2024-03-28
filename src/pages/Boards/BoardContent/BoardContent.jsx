import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
  // PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Column/Column'
import Cards from './ListColumns/Column/ListCards/Card/Cards'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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

  // card or column is dragging
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Find the column that contains the card with the specified ID
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // if dragging card, set old column
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.data?.current?._id))
    }
  }

  const handleDragOver = (event) => {
    // if activeDragItemType is column, return
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // console.log('handleDragOver', event)
    const { active, over } = event

    // if active or over is null, return
    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    // find 2 column by card id
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // if there is no active column or over column, return
    if (!activeColumn || !overColumn) return

    // if active column is different from over column
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        // Find the index of the over card in the over column
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        // Calculate the new index of the dragged card
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // clone the previous columns
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        if (nextActiveColumn) {
          // delete the dragged card from the active column
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // update the cardOrderIds of the active column
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if (nextOverColumn) {
          // check if there is a card with the same ID in the over column
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // insert the dragged card into the over column at the new index
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

          // update the cardOrderIds of the over column
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns
      })
    }
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    // Get the active and over columns
    const { active, over } = event

    // if active or over is null, return
    if (!active || !over) return

    // drag drop card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      // find 2 column by card id
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // if there is no active column or over column, return
      if (!activeColumn || !overColumn) return

      // drag between 2 different columns or same column
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // console.log('different column')
      } else {
        // console.log('same column')
        // Find the index of the card being dragged
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // Find the index of the card being dragged over
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        // Move the dragged card to the new index
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        // update state
        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns)
          // find the target column where the card is dropped
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          // update the cards and cardOrderIds of the target column
          if (targetColumn) {
            targetColumn.cards = dndOrderedCards
            targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          }

          return nextColumns
        })
      }
    }

    // drag drop column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // if active and over are different columns
      if (active.id !== over.id) {
        // Find the index of the column being dragged
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Find the index of the column being dragged over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // Move the dragged column to the new index
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // xu ly du lieu de luu vao db khi goi api
        // const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns', dndOrderedColumns)
        // console.log('dndOrderedColumnIds', dndOrderedColumnIds)

        // update state
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // reset state
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // drop animation
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  return (
    <DndContext
      sensors={mySensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {/* If activeDragItemType is falsy (e.g., null, undefined, false, 0, NaN, or an empty string), render nothing.
            * If activeDragItemType is truthy and its value is equal to ACTIVE_DRAG_ITEM_TYPE.COLUMN,
            * render the Column component and pass activeDragItemData as a prop named column to it.
            * If activeDragItemType is truthy and its value is equal to ACTIVE_DRAG_ITEM_TYPE.CARD,
            * render the Cards component and pass activeDragItemData as a prop named card to it.
            * */}
          {!activeDragItemType && null}
          {(activeDragItemType && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Cards card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent