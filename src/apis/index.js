import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_URL } from '~/utils/constants'
import { toast } from 'react-toastify'

// CRUD boards
// Đã di chuyển function gọi API này sang bên Redux
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await authorizedAxiosInstances.get(`${API_URL}/v1/boards/${boardId}`)
//   // axios return data in request.data
//   return response.data
// }
export const createNewBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_URL}/v1/boards`, data)
  toast.success('Board created successfully')
  return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_URL}/v1/boards${searchPath}`)
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_URL}/v1/boards/${boardId}`, updateData)
  // axios return data in request.data
  return response.data
}

// CRUD column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(`${API_URL}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_URL}/v1/columns/${columnId}`, updateData)
  // axios return data in request.data
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_URL}/v1/columns/${columnId}`)
  // axios return data in request.data
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_URL}/v1/boards/supports/moving_card`, updateData)
  // axios return data in request.data
  return response.data
}

// CRUD card
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(`${API_URL}/v1/cards`, newCardData)
  return response.data
}

// User authentication
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_URL}/v1/users/register`, data)
  toast.success('Account created successfully! Please check and verify your account before logging in!')
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_URL}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our services! Have a good day!')
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.put(`${API_URL}/v1/users/refresh_token`)
  return response.data
}