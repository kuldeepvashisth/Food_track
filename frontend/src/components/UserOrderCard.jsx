import React from 'react'
import { FaLocationDot, FaTruck } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
const titleCase = (value = '') => value.replace(/\b\w/g, character => character.toUpperCase())

function UserOrderCard({ order }) {
  if (!order) return null
const navigate = useNavigate()
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Date unavailable'
  const paymentLabel = order.paymentMethod === 'cod' ? 'COD' : titleCase(order.paymentMethod || 'Online')
  const orderStatus = titleCase(order.shopOrders?.[0]?.status || 'pending')

  return (
    <article className='w-full overflow-hidden rounded-xl border border-orange-100 bg-white shadow-md'>
      <header className='flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-5'>
        <div>
          <p className='text-sm font-bold text-gray-800'>Order #{String(order._id || '').slice(-7) || 'unknown'}</p>
          <p className='mt-1 text-xs text-gray-500'>Date: {orderDate}</p>
        </div>
        <div className='text-right'>
          <p className='text-sm  font-medium bold uppercase text-black-900'>{paymentLabel}</p>
        </div>
      </header>

      <div className='divide-y divide-gray-200 px-4 sm:px-5'>
        {(order.shopOrders || []).map((shopOrder, shopIndex) => {
          const shopName = shopOrder.shopName?.name || shopOrder.shopName || `Shop ${shopIndex + 1}`
          const items = shopOrder.shopOrderItems || []

          return (
            <section key={shopOrder._id || `${shopName}-${shopIndex}`} className='py-4'>
              <h2 className='mb-3 text-sm font-semibold text-gray-800'>{shopName}</h2>
              <div className='flex flex-wrap gap-3'>
                {items.map((shopItem, itemIndex) => {
                  const item = shopItem.item || {}
                  const itemName = shopItem.name || item.name || 'Food item'
                  const itemImage = item.image || shopItem.image
                  const itemPrice = Number(shopItem.price ?? item.price ?? 0)
                  const quantity = Number(shopItem.quantity || 0)

                  return (
                    <div key={shopItem._id || `${itemName}-${itemIndex}`} className='flex w-full max-w-[290px] gap-3 rounded-lg border border-gray-300 p-2.5 sm:w-[calc(50%-6px)]'>
                      {itemImage ? (
                        <img src={itemImage} alt={itemName} className='h-16 w-20 shrink-0 rounded-md object-cover' />
                      ) : (
                        <div className='flex h-16 w-20 shrink-0 items-center justify-center rounded-md bg-orange-50 text-center text-[10px] text-orange-500'>No image</div>
                      )}
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-semibold text-gray-800'>{itemName}</p>
                        <p className='mt-1 text-xs text-gray-500'>Qty: {quantity} x ₹{itemPrice}</p>
                        <p className='mt-1 text-xs font-medium text-gray-700'>₹{(itemPrice * quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className='mt-4 flex items-center justify-between border-t border-gray-300 pt-3'>
                <p className='text-sm font-semibold text-gray-800'>Subtotal: ₹{Number(shopOrder.subTotal || 0).toFixed(2)}</p>
                <span className='text-xs font-semibold capitalize text-[#2878c8]'>{shopOrder.status || 'pending'}</span>
              </div>
            </section>
          )
        })}
      </div>

      <footer className='flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-4 sm:px-5'>
        <div className='flex items-center gap-3'>
          <p className='text-sm font-bold text-gray-800'>Total: ₹{Number(order.totalAmount || 0).toFixed(2)}</p>
          {order.deliveryAddress?.text && (
            <span className='hidden items-center gap-1 text-xs text-gray-500 md:flex' title={order.deliveryAddress.text}>
              <FaLocationDot className='text-[#ff4d2d]' /> Delivery address saved
            </span>
          )}
        </div>
        <button type='button' className='flex items-center gap-2 rounded-md bg-[#ff4d2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e74327]'
         onClick={() =>navigate(`/track-order/${order._id}`)}>
          <FaTruck /> Track Order
        </button>
      </footer>
    </article>
  )
}

export default UserOrderCard