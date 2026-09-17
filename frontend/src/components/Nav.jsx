import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { IoMdCart } from 'react-icons/io';
import { IoReceipt } from 'react-icons/io5';
import axios from 'axios';
import { serverUrl } from '../config.js';
import { setUserData } from '../redux/UserSlice.js';
function Nav() {
  const {
    userData,
    currentCity,
    currentState,
    currentAddress,
    cartItems,
  } = useSelector((state) => state.user);
  const { myshopData } = useSelector((state) => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOwner = userData?.role === 'owner';
  const isUser = userData?.role === 'user';
  const fullLocation = [currentAddress, currentCity, currentState]
    .filter(Boolean)
    .join(', ');

  const handleLogout = async () => {
    try { await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true }); }
    catch (error) { console.error('Logout request failed:', error); }
    finally { dispatch(setUserData(null)); setShowInfo(false); navigate('/login'); }
  };

  return <nav className='fixed top-0 z-[9999] flex h-20 w-full items-center justify-between gap-3 bg-[#fff9f6] px-4 shadow-sm sm:px-6'>
    <button onClick={() => navigate('/')} className='text-2xl font-bold text-[#ff4d2d]'>Vingo</button>
    {isUser && (
      <div className='hidden max-w-2xl flex-1 items-center rounded-xl border border-orange-100 bg-white px-3 py-2 md:flex'>
        <FaLocationDot className='mr-2 shrink-0 text-[#ff4d2d]' />
        <span
          title={fullLocation || 'Your location'}
          className='min-w-0 flex-[1.7] border-r border-orange-100 pr-3 text-sm text-slate-500'
        >
          {fullLocation || 'Your location'}
        </span>
        <FaSearch className='mx-3 shrink-0 text-[#ff4d2d]' />
        <input
          className='min-w-0 flex-1 outline-none'
          placeholder='Search food...'
        />
      </div>
    )}
    <div className='flex items-center gap-3'>
      {isOwner && myshopData && <button onClick={() => navigate('/add-item')} className='hidden items-center gap-2 rounded-xl bg-[#ff4d2d]/10 px-3 py-2 text-sm font-semibold text-[#ff4d2d] md:flex'><FaPlus /> Add Food Item</button>}
      {isOwner && <button className='hidden items-center gap-2 rounded-xl bg-[#ff4d2d]/10 px-3 py-2 text-sm font-semibold text-[#ff4d2d] md:flex' onClick={() => navigate('/my-orders')}><IoReceipt /> My Orders</button>}
      {isUser && <div>
        <button className='relative top-10 right-14 text-[#ff4d2d]'onClick={()=>navigate('/cart')}>
        {/* Cart icon*/}
        <IoMdCart size={36} />
        <span className='absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff4d2d] text-[10px] text-white'>
          {cartItems.length}
        </span>
      </button>
      <button className='relative bottom-3 hidden rounded-xl bg-[#ff4d2d]/10 px-4 py-4 text-sm font-semibold text-[#ff4d2d] md:block' onClick={()=>navigate("/my-orders")}>My Orders</button>
      </div>}
      <button onClick={() => setShowInfo((value) => !value)} className='flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d2d] font-semibold text-white shadow-md'>{userData?.Name?.slice(0, 1)?.toUpperCase() || ''}</button>
    </div>
    {showInfo && <div className='absolute right-4 top-[72px] w-48 rounded-xl bg-white p-4 shadow-xl'><p className='font-semibold text-slate-800'>{userData?.Name || ''}</p><p className='mt-1 text-sm text-slate-500'>{userData?.Email || ''}</p><button onClick={handleLogout} className='mt-4 font-semibold text-[#ff4d2d]'>Log out</button></div>}
  </nav>;
}

export default Nav;
