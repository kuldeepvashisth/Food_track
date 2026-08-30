import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import CartItemCard from '../components/CartItemCard';

export default function CartPage() {
    const navigate = useNavigate();
    const { cartItems, totalAmount } = useSelector(state => state.user)
    return (
        <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center
      font-semibold p-6'>
            <div className='w-full max-w-[800px]'>
                <div className=' flex items-center gap-[2px] mb-6 '>
                    <div className='cursor-pointer' onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                    </div>
                    <h1 className='text-2xl font-bold text-start'>Your Cart </h1>
                </div>
                {cartItems?.length == 0 ? (
                    <p className='text-gray-500 text-lg text-center'>Your Cart Is Empty</p>
                ) : (<>
                    <div className='space-y-4'>
                        {cartItems?.map((item, index) => (
                            <CartItemCard data={item} key={index} />
                        ))}
                    </div>
                    {/* total amount */}
                    <div className='mt-6 flex items-center justify-between rounded-xl bg-white p-5 shadow-md border border-orange-100'>
                        <h1 className='text-lg font-semibold text-gray-800'>
                            Total Amount
                        </h1>

                        <span className='text-2xl font-bold text-[#ff4d2d]'>
                            ₹{totalAmount.toFixed(2)}
                        </span>
                    </div>

                    <button className='mt-6 w-full rounded-xl bg-[#ff4d2d] py-3 text-white 
                    font-bold hover:bg-[#ff4d2d] focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] 
                    focus:ring-opacity-50' onClick={() => navigate('/checkout')}>
                        Proceed to Checkout
                    </button>

                </>
                )}
            </div>

        </div>
    )
}
