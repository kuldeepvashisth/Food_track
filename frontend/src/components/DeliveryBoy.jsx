import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaLocationDot, FaPhone, FaTruck } from 'react-icons/fa6'
import { useEffect } from 'react'
import axios from 'axios';
import { serverUrl } from '../config.js'
function DeliveryBoy() {
  const { userData, myOrders } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const orders = Array.isArray(myOrders) ? myOrders : []

  //  const { userData } = useSelector(state => state.user)

    const getAssignments = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/order/get-assignments`,
                { withCredentials: true }
            )
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAssignments()
    }, [userData])

  return (
    <main className='min-h-screen bg-[#fff9f6] pb-12 pt-28'>
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6'>
        <header className='mb-8 rounded-3xl bg-gradient-to-r from-[#ff4d2d] to-[#ff754d] px-6 py-8 text-white shadow-xl shadow-orange-200 sm:px-9'>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-white/80'>Delivery dashboard</p>
          <div className='mt-3 flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20'><FaTruck className='h-6 w-6' /></span>
              <div><h1 className='text-2xl font-bold sm:text-3xl'>Welcome, {userData?.Name || 'Delivery partner'}</h1>
              <p className='mt-1 text-sm text-white/85'>Your nearby delivery requests at a glance.</p>
              </div>
            </div>
            <button onClick={() => navigate('/my-orders')} className='rounded-xl bg-white px-4 py-2.5 text-sm font-bold 
            text-[#f04a2d] transition hover:bg-orange-50'>View all requests</button>
          </div>
        </header>

        <section className='rounded-3xl border border-orange-100 bg-white p-5 shadow-lg shadow-orange-100/50 sm:p-6'>
          <div><p className='text-xs font-bold uppercase tracking-[0.16em] text-[#ff4d2d]'>Delivery requests</p>
          <h2 className='mt-1 text-2xl font-bold text-slate-800'>Orders near you</h2>
          <p className='mt-1 text-sm text-slate-500'>{orders.length} active {orders.length === 1 ? 'request' : 'requests'}</p>
          </div>

          {orders.length > 0 ? <div className='mt-6 grid gap-4 lg:grid-cols-2'>{orders.map((order) => {
            const shopOrder = order.shopOrders?.find((item) => item.assignment) || order.shopOrders?.[0]
            return <article key={order._id} className='rounded-2xl border border-orange-100 bg-orange-50/40 p-5'>
              <div className='flex items-start justify-between gap-3'><div><p className='text-sm font-bold text-slate-800'>Order #{String(order._id).slice(-7)}</p>
              <p className='mt-1 text-sm font-semibold text-slate-700'>{shopOrder?.shopName?.name || shopOrder?.shopName || 'Shop unavailable'}</p>
              <p className='mt-1 text-xs capitalize text-[#2878c8]'>{shopOrder?.status || 'pending'}</p></div>
              <p className='text-sm font-bold text-[#ff4d2d]'>₹{Number(shopOrder?.subTotal || 0).toFixed(2)}</p></div>
              <p className='mt-4 flex gap-2 text-sm text-slate-600'><FaLocationDot className='mt-1 shrink-0 text-[#ff4d2d]' />{order.deliveryAddress?.text || 'Address unavailable'}</p>
              <p className='mt-3 flex gap-2 text-sm text-slate-600'><FaPhone className='mt-1 shrink-0 text-[#ff4d2d]' />{order.user?.mobile || 'Customer phone unavailable'}</p>
            </article>
          })}</div> 
          :
           <div className='mt-6 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-10 text-center'>
            <FaTruck className='mx-auto h-10 w-10 text-[#ff4d2d]' />
            <h3 className='mt-3 font-bold text-slate-800'>No delivery requests yet</h3>
            <p className='mt-1 text-sm text-slate-500'>New nearby orders will appear here.</p>
            </div>}
        </section>
      </div>
    </main>
  )
}

export default DeliveryBoy