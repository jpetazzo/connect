import React, { useEffect, Suspense } from 'react'

import { Provider as StoreProvider } from 'react-redux'
import './App.scss'
import { history, Router } from './services/history/history'
import { Routes } from './components/Routes'
import { store } from './redux/store'
import { profileFetchStart } from './redux/user/actions'
import AppNotification from './components/AppNotification'
import { Loader } from './components/atoms'

const App = () => {
  useEffect(() => {
    store.dispatch(profileFetchStart())
  }, [])

  return (
    <>
      <AppNotification />
      <StoreProvider store={store}>
        <Router history={history}>
          <Suspense fallback={<Loader loading={true} />}>
            <Routes />
          </Suspense>
        </Router>
      </StoreProvider>
    </>
  )
}

export default App
