import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
export default function CartPage() {
    const navigate = useNavigate();
    return (
        <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center
     text-[#ff4d2d] font-semibold p-6'>
            <div className='w-full max-w-[800px]'>
                <div className=' flex items-center gap-[20px] mb-6'
                div
                onClick={() => navigate("/")}>
                    <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                </div>
                <h1>Your Cart </h1>
            </div>

        </div>
    )
}
