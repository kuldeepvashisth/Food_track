import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaLocationDot, FaPhone, FaTruck } from 'react-icons/fa6'
import axios from 'axios';
import { serverUrl } from '../config.js'
import DeliveryBoyTracking from './DeliveryBoyTracking.jsx'

function DeliveryBoy() {
  const { userData, myOrders } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const orders = Array.isArray(myOrders) ? myOrders : []
  const [currentOrder, setCurrentOrder] = useState(null)
  const [currentOrderError, setCurrentOrderError] = useState('')
  const [acceptingAssignmentId, setAcceptingAssignmentId] = useState(null)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] = useState('')

  const getCurrentOrder = useCallback(async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true }
      )
      setCurrentOrder(result.data)
      setCurrentOrderError('')
      return result.data;
    } catch (error) {
      if (error.response?.status === 404) {
        setCurrentOrder(null)
        setCurrentOrderError('')
        return null
      }
      console.error('Error fetching current order:', error)
      setCurrentOrderError(error.response?.data?.message || 'Unable to load your current delivery.')
      return null
    }
  }, [])

  useEffect(() => {
    if (userData?.role !== 'deliveryBoy') return undefined

    const initialRefresh = window.setTimeout(getCurrentOrder, 0)
    const refreshInterval = window.setInterval(getCurrentOrder, 5000)
    return () => {
      window.clearTimeout(initialRefresh)
      window.clearInterval(refreshInterval)
    }
  }, [getCurrentOrder, userData?.role])

  // Each newly accepted delivery must start at the "send OTP" step. This
  // prevents a previously opened OTP box from carrying over to another order.
  useEffect(() => {
    setShowOtpBox(false)
    setOtp('')
  }, [currentOrder?.order?._id, currentOrder?.shopOrder?._id])

  const handleSendOtp = async (orderId,shopOrderId) => {
    try {
    
      const result = await axios.post(
        `${serverUrl}/api/order/send-otp`,
        { orderId, shopOrderId },
        { withCredentials: true }
      )
       setShowOtpBox(true)
      alert(result.data.message || 'OTP sent successfully.')
    }
    catch (error) {
      console.error('Error sending OTP:', error)
      alert(error.response?.data?.message || 'Unable to send OTP. Please try again.')
    }
  }
  const verifyOtp = async (orderId,shopOrderId,otp) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-otp`,
        { orderId, shopOrderId, otp },
        { withCredentials: true }
      )
      alert(result.data.message || 'OTP verified successfully.')
      setOtp('')
      setShowOtpBox(false)
      await getCurrentOrder()
    }
    catch (error) {
      console.error('Error verifying OTP:', error)
      alert(error.response?.data?.message || 'Unable to verify OTP. Please try again.')
    }
  }
  const acceptOrder = async (assignmentId) => {
    setAcceptingAssignmentId(assignmentId)
    try {
      await axios.post(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        {},
        { withCredentials: true }
      )
      setShowOtpBox(false)
      setOtp('')
      await getCurrentOrder()
    } catch (error) {
      console.error('Error accepting delivery order:', error)
      alert(error.response?.data?.message || 'Unable to accept this order. Please try again.')
    } finally {
      setAcceptingAssignmentId(null)
    }
  }

  const shopAddress = currentOrder?.shop
    ? [currentOrder.shop.address, currentOrder.shop.city, currentOrder.shop.state].filter(Boolean).join(', ')
    : ''


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
              <button onClick={() => acceptOrder(shopOrder?.assignment?._id || shopOrder?.assignment)} disabled={!shopOrder?.assignment || acceptingAssignmentId === (shopOrder?.assignment?._id || shopOrder?.assignment)} className='mt-4 rounded-lg bg-[#ff4d2d] px-4 py-2 text-sm font-bold text-white hover:bg-[#e64529] disabled:cursor-not-allowed disabled:opacity-50'>
                {acceptingAssignmentId === (shopOrder?.assignment?._id || shopOrder?.assignment) ? 'Accepting...' : 'Accept'}
              </button>
            </article>
          })}</div>
            :
            <div className='mt-6 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-10 text-center'>
              <FaTruck className='mx-auto h-10 w-10 text-[#ff4d2d]' />
              <h3 className='mt-3 font-bold text-slate-800'>No delivery requests yet</h3>
              <p className='mt-1 text-sm text-slate-500'>New nearby orders will appear here.</p>
            </div>}

          {/*show current order location on map if any*/}
          {currentOrderError && <p role='alert' className='mt-4 text-sm text-red-600'>{currentOrderError}</p>}
          {currentOrder?.order && <div className='mt-6 rounded-2xl border border-orange-100 bg-orange-50/40 p-5'>
            <h3 className='text-sm font-bold text-slate-800'>Current order</h3>
            <p className='mt-1 text-sm font-semibold text-slate-700'>
              Order #{String(currentOrder.order._id).slice(-7)}
            </p>
            <div className='mt-4 space-y-3 text-sm text-slate-600'>
              <div>
                <p className='font-semibold text-slate-800'>Pickup from</p>
                <p>{currentOrder.shop?.name || currentOrder.shopOrder?.shopName?.name || 'Shop unavailable'}</p>
                <p className='flex gap-2'>
                  <FaLocationDot className='mt-1 shrink-0 text-[#ff4d2d]' />
                  <span>{shopAddress || 'Shop address unavailable'}</span>
                </p>
              </div>
              <div>
                <p className='font-semibold text-slate-800'>Customer</p>
                <p>{currentOrder.customer?.Name || currentOrder.order.user?.Name || 'Customer name unavailable'}</p>
                <p className='flex gap-2'>
                  <FaPhone className='mt-1 shrink-0 text-[#ff4d2d]' />
                  <span>{currentOrder.customer?.mobile || currentOrder.order.user?.mobile || 'Customer phone unavailable'}</span>
                </p>
              </div>
              <div>
                <p className='font-semibold text-slate-800'>Deliver to</p>
                <p className='flex gap-2'>
                  <FaLocationDot className='mt-1 shrink-0 text-[#ff4d2d]' />
                  <span>{currentOrder.deliveryAddress?.text || 'Customer delivery address unavailable'}</span>
                </p>
              </div>
            </div>
            <div className='mt-3 space-y-2'>
              {(currentOrder.shopOrder?.shopOrderItems || []).map((item, index) => (
                <p key={item._id || `${item.name}-${index}`} className='text-sm text-slate-600'>
                  {item.name || item.item?.name || 'Food item'} · Qty {item.quantity}
                </p>
              ))}
            </div>
            <p className='mt-3 text-sm font-semibold text-slate-800'>
              Subtotal: ₹{Number(currentOrder.shopOrder?.subTotal || 0).toFixed(2)}
            </p>
            <DeliveryBoyTracking data={currentOrder} />
            {/* Optionally, you can add a button to mark the order as delivered */}
            {!showOtpBox && <button onClick={() => handleSendOtp(currentOrder?.order?._id, currentOrder?.shopOrder?._id)} className='mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm 
              font-semibold text-white hover:bg-orange-600'>
              Mark as Delivered & Send OTP
            </button>
            }              {showOtpBox &&
              <div className='mt-4'>
                <p className='mb-2 text-sm font-semibold'>OTP has been sent to the customer's registered email. Enter it below to confirm delivery.</p>
                <label htmlFor='otp' className='block text-sm font-semibold text-slate-800'>Enter OTP</label>
                <input type='text' id='otp' name='otp' className='mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700
               focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50' placeholder='Enter OTP'
                onChange={(e) => setOtp(e.target.value)} value={otp} />
                <button onClick={() => verifyOtp(currentOrder?.order?._id, currentOrder?.shopOrder?._id, otp)} className='mt-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600'>
                  Submit OTP
                </button>
              </div>

            }
            {/* btn pr click ke baad ek otp generate hoga user ko and jb delivery boy use enter krega */}

          </div>
          }
        </section>
      </div>
    </main>
  )
}

export default DeliveryBoy
