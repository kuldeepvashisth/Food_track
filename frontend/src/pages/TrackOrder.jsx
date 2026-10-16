import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { serverUrl } from '../config.js'
import DeliveryBoyTracking from '../components/DeliveryBoyTracking.jsx'

function TrackOrder() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [currentOrder, setCurrentOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const totalBill = (currentOrder?.shopOrders || []).reduce(
    (total, shopOrder) => total + Number(shopOrder.subTotal || 0),
    0
  )

  useEffect(() => {
    let isActive = true

    const fetchOrder = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.get(
        `${serverUrl}/api/order/get-order/${orderId}`,
        { withCredentials: true }
      )
      if (isActive) setCurrentOrder(response.data)
    } catch (requestError) {
      console.error('Error fetching order details:', requestError)
      if (isActive) {
        setCurrentOrder(null)
        setError(requestError.response?.data?.message || 'Unable to load this order.')
      }
    } finally {
      if (isActive) setIsLoading(false)
    }
    }

    fetchOrder()
    return () => {
    isActive = false
    }
  }, [orderId])

  return (
    <main className='min-h-screen bg-[#fff9f6] px-4 py-10 text-slate-800'>
    <div className='mx-auto w-full max-w-3xl rounded-lg bg-white p-4 shadow-md sm:p-6'>
      <header className='mb-6 flex items-center'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          aria-label='Go back'
          className='mr-2 text-[#ff4d2d] hover:text-[#e74327]'
        >
          <IoIosArrowRoundBack size={28} />
        </button>
        <h1 className='text-2xl font-bold'>Track Order</h1>
      </header>

      {isLoading && <p role='status' className='text-sm text-slate-500'>Loading order details...</p>}
      {!isLoading && error && <p role='alert' className='text-sm text-red-600'>{error}</p>}
      {!isLoading && !error && currentOrder?.shopOrders?.length === 0 &&
        <p className='text-sm text-slate-500'>This order has no shop details.</p>}

      {!isLoading && !error && currentOrder?.shopOrders?.map((shopOrder) => (
        <section key={shopOrder._id} className='mb-4 rounded-lg border border-orange-100 p-4'>
          <h2 className='mb-2 text-xl font-semibold'>
            Shop: {shopOrder.shopName?.name || 'Shop unavailable'}
          </h2>
          <p className='text-sm font-medium'>
            Subtotal: ₹{Number(shopOrder.subTotal || 0).toFixed(2)}
          </p>
          <p className='mt-1 text-sm font-medium capitalize'>Status: {shopOrder.status}</p>
          {['out for delivery', 'delivered'].includes(shopOrder.status) && (
            <>
            
              {shopOrder.status === 'out for delivery' && (
                <div className='mt-3 rounded-lg bg-orange-50 p-3 text-sm'>
                  <h3 className='font-semibold'>Delivery partner</h3>
                  <p>Name: {shopOrder.assignedDeliveryBoy?.Name || 'Unavailable'}</p>
                  <p>Mobile: {shopOrder.assignedDeliveryBoy?.mobile || 'Unavailable'}</p>
                </div>
              )}
            
              {shopOrder.status === 'out for delivery' && (
                <DeliveryBoyTracking
                  data={{
                    deliveryBoyLocation: {
                      latitude: shopOrder.assignedDeliveryBoy?.location?.coordinates?.[1],
                      longitude: shopOrder.assignedDeliveryBoy?.location?.coordinates?.[0]
                    },
                    customerLocation: {
                      latitude: currentOrder.deliveryAddress?.latitude,
                      longitude: currentOrder.deliveryAddress?.longitude
                    }
                  }}
                />
              )}
            </>
          )}
          <div className='mt-3'>
            <h3 className='mb-1 font-semibold'>Items</h3>
            {(shopOrder.shopOrderItems || []).map((shopItem, index) => (
              <div
                key={shopItem._id || `${shopItem.name || shopItem.item?.name || 'Food item'}-${index}`}
                className='flex justify-between gap-3 border-b py-2 text-sm'
              >
                <span>{shopItem.name || shopItem.item?.name || 'Food item'}</span>
                <span className='text-right'>
                  {Number(shopItem.quantity || 0)} × ₹
                  {Number(shopItem.price ?? shopItem.item?.price ?? 0).toFixed(2)} = ₹
                  {(
                    Number(shopItem.quantity || 0) *
                    Number(shopItem.price ?? shopItem.item?.price ?? 0)
                  ).toFixed(2)}
                </span>
                  
              </div>
              
            ))}
          </div>
        </section>
      ))}
      {!isLoading && !error && currentOrder?.shopOrders?.length > 0 && (
        <div className='flex justify-between border-t border-orange-200 pt-4 text-lg font-bold'>
          <span>Total bill</span>
          <span>₹{totalBill.toFixed(2)}</span>
        </div>
      )}
    </div>
    </main>
  )
}

export default TrackOrder
