import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import useGetCurrentUser from './hooks/useCurrentuser.jsx'

const serverUrl = 'http://localhost:8000'
// const envServerUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'
// export const serverUrl = envServerUrl.replace(/\/$/, '')

function App() {
  useGetCurrentUser()
  return (
    <Routes>
      {/*
      1. element tell on this [ath which component should be render
       */}
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword/>} />
    </Routes>
  )
}

export default App
