import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
export const serverUrl="http://localhost:5000"
function App() {
  
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
