import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { IoIosArrowRoundBack } from 'react-icons/io'
import UserOrderCard from '../components/UserOrderCard.jsx'
import OwnerOrderCard from '../components/OwnerOrderCard.jsx'

function MyOrder() {
  const {userData,myOrders}=useSelector(state=>state.user)
  const navigate = useNavigate()
  const role = String(userData?.role || '').trim().toLowerCase()
  const orders = Array.isArray(myOrders) ? myOrders : []

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
      <div className='w-full max-w-[800px] p-4'>
     
      <div className='flex items-center gap-[20px] nb-6'>
           <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]' onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                    </div>
        <h1 className='text-2xl font-bold text-start'>My Orders</h1>
      </div>

        {orders.length > 0 ? (
          <div className='space-y-6'>
            {orders.map((order,index)=>{
              return role === 'user' ? <UserOrderCard key={order._id || index} order={order}/> :
              role === 'owner' ? <OwnerOrderCard key={order._id || index} order={order}/> : null;
            })}
          </div>
        ) : (
          <div className='mt-8 rounded-xl border border-orange-100 bg-white px-6 py-12 text-center shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-800'>No orders yet</h2>
            <p className='mt-2 text-sm text-gray-500'>Your completed orders will appear here.</p>
            <button type='button' onClick={() => navigate('/')} className='mt-5 rounded-md bg-[#ff4d2d] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#e74327]'>
              Browse food
            </button>
          </div>
        )}


        </div>



    </div>
  )
}

export default MyOrder