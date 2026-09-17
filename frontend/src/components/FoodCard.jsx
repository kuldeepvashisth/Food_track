import React, { useState } from 'react'
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { FaMinus ,FaPlusSquare} from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { addToCart } from '../redux/UserSlice';
import { useDispatch, useSelector } from 'react-redux';

function FoodCard({ data }) {
    const [quantity,setQuantity]=useState(0)
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.user.cartItems);
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                (i <= rating) ?
                    (<FaStar key={i} className='text-yellow-500 text-lg' />) :
                    (<CiStar key={i} className='text-yellow-500 text-lg' />)
            )
     
        }
        return stars;
    }

    const handleIncrease=()=>{
        const newqty=quantity+1;
        setQuantity(newqty);
    }
    
    const handleDecrease=()=>{
            if(quantity>0){
        const newqty=quantity-1;
        setQuantity(newqty);
            }
        }
    return (
        <article className='overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl'>
            {data?.image ? (
                <img src={data.image} alt={data.Name || 'Food item'} className='h-44 w-full object-cover' />
            ) : (
                <div className='flex h-44 items-center justify-center bg-orange-50 text-sm text-orange-400'>No image</div>
            )}
            <div className='p-4'>
                <div className='flex items-start justify-between gap-3'>
                    <h3 className='font-bold text-slate-800'>{data?.Name || 'Food item'}</h3>
                    {/* <span className='font-bold text-[#ff4d2d]'>₹{data?.price}</span> */}
                    <span className='rounded-full bg-orange-50 px-2.5 py-1 capitalize text-orange-700'>{data?.Foodtype}</span>
                </div>
                <div className='flex gap-2 text-xs'>

                    {/* <span className={data?.Foodtype === 'veg' ? 'text-emerald-600' : 'text-rose-600'}>{data?.category}</span> */}
                </div>

                <div className=' mt-2 flex flex-row items-center gap-1 mt-1'>
                    <span className='flex flex-row gap-1 text-xs text-gray-500'>
                        {renderStars(data.rating?.average || 0)}
                    </span>
                </div>

              <div className='flex flex-row gap-19 items-center justify-between w-full mt-auto p-1'>

  <span className='font-bold text-gray-900 text-lg'>
    ₹{data.price}
  </span>

  <div className='flex flex-row items-center shrink-0 border rounded-full overflow-hidden shadow-sm'>

    <button className='px-2 py-1 hover:bg-gray-100 transition'onClick={handleDecrease}  >
        <FaMinus />
     
    </button>

    <span className='text-orange-600 px-2'>
      {quantity}
    </span>

    <button className='px-2 py-1 hover:bg-gray-100 transition'onClick={handleIncrease}>
    
      <FaPlusSquare />
    </button>
      
    <button className={`cursor-pointer ${cartItems.some(item => item.id === data._id) ? 'bg-gray-800 ' :
     'bg-[#ff4d2d]'} text-white px-3 py-2`}
     onClick={()=>
        quantity>0?
        dispatch(addToCart({
       id:data._id,
      name:data.Name,
      price:data.price,
      image:data.image,
      shop:data.shop,
        shopId:data.shop,
      quantity,
      foodType:data.Foodtype,
    })):null}>
            <FaCartShopping/>
    </button>



  </div>


</div>
            </div>
        </article>
    )
}

export default FoodCard