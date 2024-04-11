import axios from 'axios'
import { API_URL } from '~/utils/constants'

// CRUD board
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_URL}/v1/boards/${boardId}`)
  // axios return data in request.data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_URL}/v1/boards/${boardId}`, updateData)
  // axios return data in request.data
  return response.data
}

// CRUD column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_URL}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_URL}/v1/columns/${columnId}`, updateData)
  // axios return data in request.data
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_URL}/v1/columns/${columnId}`)
  // axios return data in request.data
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_URL}/v1/boards/supports/moving_card`, updateData)
  // axios return data in request.data
  return response.data
}

// CRUD card
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_URL}/v1/cards`, newCardData)
  return response.data
}