// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
// import { ThemeProvider } from '@mui/material/styles'
import theme from '~/theme'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import GlobalStyles from '@mui/material/GlobalStyles'

// config react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ConfirmProvider } from 'material-ui-confirm'

// Config Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store'

// Config react-router-dom into project with BrowserRouter
// https://reactrouter.com/en/main/router-components/browser-router
import { BrowserRouter } from 'react-router-dom'

// Config Redux-Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

// Use injectStore(store) in the file you want to use store outside of react component
// https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
import { injectStore } from '~/utils/authorizeAxios'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename="/">
        <CssVarsProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            dialogProps: { maxWidth: 'xs' },
            confirmationButtonProps: { color: 'error' },
            cancellationButtonProps: { color: 'primary', variant: 'contained' },
            allowClose: false
          }}>
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-right' theme='colored' />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
