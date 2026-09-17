import React, { useState } from 'react'
import axios from 'axios'
import { FaLocationDot, FaPhone, FaUser } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { serverUrl } from '../config.js'
import { useDispatch } from 'react-redux'
import { updatOrderStatus } from '../redux/UserSlice.js'

function OwnerOrderCard({ order }) {
  const initialAvailableBoys = order?.availableDeliveryBoys || order?.shopOrders?.[0]?.assignment?.broadcastedTo || []
  const [availableBoys, setAvailableBoys] = useState(initialAvailableBoys)
  const shopOrder = order?.shopOrders?.[0]
  const [status, setStatus] = useState(shopOrder?.status || order?.status || 'pending')
  const [isSaving, setIsSaving] = useState(false)

  const dispatch = useDispatch()

  if (!order) return null

  const customer = order.user || {}
  const items = shopOrder?.shopOrderItems || []
  const orderId = String(order._id || '').slice(-7) || 'unknown'
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Date unavailable'

  // Save the selected status for this owner's shop order.
  const handleStatusChange = async (orderId, shopId, status) => {
    const nextStatus = status
    const previousStatus = shopOrder?.status || 'pending'
    setStatus(nextStatus)
    setIsSaving(true)

    try {
      const response = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status: status },
        { withCredentials: true }
      )

      dispatch(updatOrderStatus({ orderId, shopId, status: nextStatus }))
      setAvailableBoys(response.data?.availableBoys || [])
    } catch (error) {
      setStatus(previousStatus)
      console.error('Error updating order status:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <article className='overflow-hidden rounded-xl border border-orange-100 bg-white shadow-md'>
      {/* Order header contains the customer, date, payment method, and status. */}
      <header className='flex flex-wrap justify-between gap-3 border-b border-gray-200 p-4'>
        <div>
          <p className='text-sm font-bold text-gray-800'>Order #{orderId}</p>
          <p className='mt-1 text-xs text-gray-500'>{customer.Name || customer.Email || 'Customer'} | {orderDate}</p>
        </div>
        <div className='text-right'>
          <p className='text-xs font-semibold uppercase text-gray-400'>{order.paymentMethod === 'cod' ? 'COD' : 'Online'}</p>

          <select value={status} onChange={(e) => handleStatusChange(order._id, shopOrder._id, e.target.value)} disabled={isSaving || !shopOrder?._id} className='mt-1 rounded-md border border-blue-200
           bg-blue-50 px-2 py-1 text-sm font-semibold text-[#2878c8] outline-none focus:ring-2 focus:ring-blue-200'>
            <option value='pending'>Pending</option>
            <option value='processing'>Processing</option>
            <option value='out for delivery'>Out for delivery</option>
            <option value='delivered'>Delivered</option>
          </select>
          <p className='mt-1 text-xs font-semibold capitalize text-[#2878c8]'>Order status: {status}</p>
          {isSaving && <p className='mt-1 text-[10px] text-gray-400'>Saving...</p>}
        </div>
      </header>

      <div className='p-4'>
        <p className='mb-3 text-sm font-semibold text-gray-800'>{shopOrder?.shopName?.name || 'Your shop'}</p>

        {/* Customer and delivery details help the owner prepare and deliver the order. */}
        <div className='mb-4 rounded-lg bg-orange-50/70 p-3 text-sm text-gray-700'>
          <p className='mb-2 font-semibold text-gray-800'>Delivery details</p>
          <div className='grid gap-2 sm:grid-cols-2'>
            <p className='flex items-center gap-2'><FaUser className='text-[#ff4d2d]' /> {customer.Name || 'Name unavailable'}</p>
            <p className='flex items-center gap-2 break-all'><MdEmail className='shrink-0 text-[#ff4d2d]' /> {customer.Email || 'Email unavailable'}</p>
            <p className='flex items-center gap-2'><FaPhone className='text-[#ff4d2d]' /> {customer.mobile || 'Phone unavailable'}</p>
            <p className='flex items-start gap-2 sm:col-span-2'><FaLocationDot className='mt-1 shrink-0 text-[#ff4d2d]' /> {order.deliveryAddress?.text || 'Delivery address unavailable'}</p>
          </div>
        </div>

        {/* Items are already limited to this owner's shop by the backend. */}
        <div className='space-y-3'>
          {items.map((shopItem, index) => {
            const item = shopItem.item || {}
            const name = shopItem.name || item.name || 'Food item'
            const price = Number(shopItem.price ?? item.price ?? 0)
            const quantity = Number(shopItem.quantity || 0)

            return (
              <div key={shopItem._id || `${name}-${index}`} className='flex items-center gap-3 rounded-lg border border-gray-200 p-2'>
                {item.image ? <img src={item.image} alt={name} className='h-14 w-16 rounded-md object-cover' /> : <div className='flex h-14 w-16 items-center justify-center rounded-md bg-orange-50 text-xs text-orange-500'>No image</div>}
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-semibold text-gray-800'>{name}</p>
                  <p className='text-xs text-gray-500'>Qty: {quantity} x ₹{price}</p>
                </div>
                <p className='text-sm font-semibold text-gray-800'>₹{(price * quantity).toFixed(2)}</p>
              </div>
            )
          })}
        </div>
        {/* delivery Boy column */}
        {status === 'out for delivery' &&
          <div className="mt-3 p-2 border rounded-lg text-sm bg-orange-50 gap-4">
            <p>Available Delivery Boys:</p>
            {availableBoys?.length > 0 ? (
              availableBoys.map((b, index) => (
                <div key={b._id || b.id || index} className="text-gray-800">{b.fullName || b.Name || 'Delivery boy'}-{b.mobile || 'Phone unavailable'}</div>
              ))
            ) : <div>Waiting for delivery boy to accept</div>}
          </div>}
        <div className='mt-4 flex items-center justify-between border-t border-gray-200 pt-3'>
          <p className='text-sm font-bold text-gray-800'>Subtotal: ₹{Number(shopOrder?.subTotal || 0).toFixed(2)}</p>
        </div>
      </div>
    </article>
  )
}

export default OwnerOrderCard