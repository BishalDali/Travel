import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import { Provider } from 'react-redux'
import {store} from './features/app/store.ts'

const theme = extendTheme({
  brand : {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
  font : {
    body: 'Roboto',
    heading: 'Roboto',
  }
})



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
    </ Provider>
  </React.StrictMode>,

)
