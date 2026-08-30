import React from 'react'
import { FaMinus ,FaPlusSquare} from "react-icons/fa";
import { CiTrash} from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQunatity } from '../redux/UserSlice';
function CartItemCard({data}) {
    const dispatch=useDispatch();
    
    const handleIncrease=(id)=>{
      dispatch(updateQunatity({id,quantity:1}))
    }
    
    const handleDecrease=(id, currentQty)=>{
            if(currentQty > 1){
              dispatch(updateQunatity({id,quantity:-1}))
            }
        }
  return (
    <div className='flex items-center justify-between gap-4 rounded-xl bg-white p-4  shadow-border'>
             <div className='flex items-center gap-4'>  
                    <img src={data.image} alt="" className='w-20 h-20 object-cover rounded-g border'/>
                    <div>
                        <h1 className='font-medium text-gray-800'>{data.name}</h1>
                        {/* due to it our price change dynamically as we change the qty */}
                        <p className='text-sm text-gray-500'>₹{data.price}x{data.quantity}</p> 
                        <p className='font-bold text-gray-900'>₹{ (data.price * data.quantity).toFixed(2) }</p>
                    </div>

               
                
            </div>

            <div className='flex items-center'>
                 
                
                    <button className='p-2 hover:bg-gray-200 cursor-pointer rounded-full'onClick={() => handleDecrease(data.id, data.quantity)}  >
                        <FaMinus size={12}/>
                     
                    </button>
                
                    <span className='text-xxl text-orange-600 p-2'>
                      {data.quantity}
                    </span>
                
                    <button className='p-2 hover:bg-gray-200 cursor-pointer rounded-full'onClick={() => handleIncrease(data.id)}>
                      <FaPlusSquare />
                    </button>

                    {/* delte button */}
                    <button className='p-2 bg-red-100 text-red-600 rounded-full'onClick={() => dispatch(removeCartItem(data.id))}>
                      <CiTrash size={18}/>
                    </button>
                   

            </div>
    </div>
  )
}

export default CartItemCard