import axios from 'axios'
import { API_URL } from '~/utils/constants'

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_URL}/v1/boards/${boardId}`)
  // axios return data in request.data
  return response.data
}