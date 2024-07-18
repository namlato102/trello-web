import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Inject the main Redux store into the axios instance to use the store outside of the react component.
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */
let axiosReduxStore
export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}

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

/**
 * Promise that represents the refresh token.
 * After calling refreshTokenAPI, retry all the failed requests that need to be retried.
 * @type {Promise|null}
 */
let refreshTokenPromise = null

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

  // Handle refresh token automatically
  // If the error response status is 401, then call logoutUserAPI to logout user
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // If the error response status is 410, then call refreshTokenAPI to refresh access token
  // Find all the request that has been failed and need to be retried
  // https://www.thedutchlab.com/en/insights/using-axios-interceptors-for-refreshing-your-api-token
  const originalRequest = error.config
  // console.log('originalRequest: ', originalRequest)
  if (error.response?.status === 410 && originalRequest) {
    // If there is no refreshTokenPromise, then call refreshTokenAPI and assign it to refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          return data?.accessToken
        })
        .catch((_error) => {
          // If there is any error from refreshTokenAPI, then call logoutUserAPI to logout user
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          // Even if the refresh_token API is successful or failed, always set the refreshTokenPromise back to null as before
          refreshTokenPromise = null
        })
    }

    // If there is refreshTokenPromise, then call all the request that has been failed and need to be retried
    return refreshTokenPromise.then(() => {
      return authorizedAxiosInstance(originalRequest)
    })
  }

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