import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import useGetCurrentUser from './hooks/UseCurrentuser.jsx'
import { useSelector } from 'react-redux'
import Home from './pages/Home.jsx'
import useGetCity from './hooks/UseGetCity.jsx'
import useGetMyShop from './hooks/UseGetMyShop.jsx'
import CreateEditShop from './pages/CreateEditShop.jsx'
import useGetitemsByCity from './hooks/UseGetItemBycity.jsx'
import Additem from './pages/Additem.jsx'
import EditItem from './pages/EditItem.jsx'
import CartPage from './pages/CartPage.jsx'
// import UseGetShopbyCity from './hooks/UseGetShopbyCity.jsx'
function App() {
    const { isLoading } = useGetCurrentUser();
  const { isLoading: isCityLoading } = useGetCity();
  useGetMyShop()
  useGetitemsByCity()
  const {userData}=useSelector(state=>state.user)
  if (isLoading || isCityLoading) {
    return <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center text-[#ff4d2d] font-semibold'>Loading FoodTrack...</div>
  }
  return (
     <Routes>
       <Route path='/signup' element={ !userData? <Signup />:<Navigate to={"/"}/> }/>
       <Route path='/login' element={ !userData? <Login />:<Navigate to={"/"}/> }/>
       <Route path='/forgot-password' element={ !userData? <ForgotPassword />:<Navigate to={"/"}/> }/>
       <Route path='/' element={userData? <Home/>:<Navigate to={"/Login"}/> }/>   
      <Route path='/create-edit-shop' element={userData? <CreateEditShop/>:<Navigate to={"/Login"}/> }/>   
      <Route path='/add-item' element={userData? <Additem/>:<Navigate to={"/Login"}/> }/>   
      <Route path='/cart' element={userData? <CartPage/>:<Navigate to={"/Login"}/> }/>   
      <Route
        path='/edit-item/:itemId'
        element={userData ? <EditItem /> : <Navigate to='/login' />}
      />
        
     </Routes>
  )
}

 // <>
    //   {isAuthenticated}
    //   <Routes>
    //     <Route path='/signup' element={isAuthenticated ? <Navigate to="/"  /> : <Signup />} />
    //     <Route path='/login' element={isAuthenticated ? <Navigate to="/"  /> : <Login />} />
    //     <Route path='/forgot-password' element={isAuthenticated ? <Navigate to="/"  /> : <ForgotPassword />} />
    //     <Route path='/' element={isAuthenticated ? <Home /> : <Navigate to="/login"  />} />
    //     <Route path='*' element={<Navigate to={isAuthenticated ? '/' : '/login'}  />} />
    //     <Route path='/create-edit-shop' element={<Navigate to={isAuthenticated ? '/' : '/login'}  />} />
        
    //   </Routes>
    // </>

export default App;
