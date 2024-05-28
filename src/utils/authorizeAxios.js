import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// create a new instance of axios to customize and configure for the project
let authorizedAxiosInstance = axios.create()

// set timeout for axios request to 10 minutes
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: true allow axios to automatically send cookies in each request to the BE (serve the purpose of storing JWT tokens (refresh & access) in the httpOnly Cookie of the browser)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * config Interceptors:
 * interceptors are functions that Axios calls for every request and response before they are handled by then or catch.
 * https://axios-http.com/docs/interceptors
 */
// Add a request interceptor:
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Do something before request is sent
  // avoid user spam click at any button or link that call api
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor:
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  interceptorLoadingElements(false)

  // handle all error response messages from axios call api
  let errorMessage = error.message
  // console.log('error response:', error.response)
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // use toastify to show error message on screen for all error status code - except 410 - GONE for auto refresh token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance