
// api endpoints
let apiRoot = ''
if (import.meta.env.DEV) {
  apiRoot = 'http://localhost:8017'
}

if (import.meta.env.PROD) {
  apiRoot = 'https://trello-api-7mit.onrender.com'
}

export const API_URL = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}