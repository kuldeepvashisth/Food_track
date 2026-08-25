import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useEffect, useState } from 'react';
import { setMyShopData } from '../redux/ownerSlice';
import axios from 'axios';
import { serverUrl } from '../config.js';



function CreateEditShop() {
    const navigate = useNavigate();
    // const { myShopData } = useSelector(state => state.user)
    const { myshopData } = useSelector(state => state.owner)
    const dispatch=useDispatch()
    const {currentCity,currentState,currentAddress}=useSelector(state=>state.user)
    const [name, setName] = useState(myshopData?.name || "")
    const [city,setCity]=useState(myshopData?.city || currentCity || "")
    const [state,setState]=useState(myshopData?.state || currentState || "")
    const [address,setAddress]=useState(myshopData?.address || currentAddress || "")
    const [frontendImage,setFrontendImage]=useState(myshopData?.image || null)
    const [backendImage,setBackendImage]=useState(null)


    const handleImage=(e)=>{
        const file=e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
    
    const handleSubmit=async (e) => {
         e.preventDefault() //taki baar0 baar refresh na ho

         try{
            const formData=new FormData() // FormData :- ek class hoti hai js mai form ka data bhejne ke lie by using append
            formData.append("name",name)
            formData.append("city",city)
            formData.append("state",state)
            formData.append("address",address)
 
            if(backendImage){
            formData.append("image",backendImage)
            }
                const result = await axios.post(
            `${serverUrl}/api/shop/create-edit-shop`,
            formData,
            {
                withCredentials: true
            }
        );
            navigate("/") // Navigate to home page after successful shop creation
            dispatch(setMyShopData(result.data));
            console.log("Shop created successfully:", result.data);
         }
       
        catch (err) {
    console.log("STATUS:", err.response?.status);
    console.log("BACKEND ERROR:", err.response?.data);
    console.log("FULL ERROR:", err);
}

    }

    return (
        <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br-from-orange-50 relative to-white min-h-screen'>
            <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]' onClick={() => navigate("/")}>
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
            </div>
            <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
                <div className='flex flex-col items-center mb-6'>
                    <div className='bg-orange-100 p-4 rounded-full mb-4'>
                        <GiForkKnifeSpoon className='text-[#ff4d4d] w-16 h-16' />
                    </div>
                    <div className='text-3xl font-extrabold text-gray-900'>
                        {myshopData ? "Edit Shop" : "Add Shop"}
                    </div>
                </div>
                <form className='space-y-5' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                        <input  type="text" placeholder='Enter Shop Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-500' onChange={(e) => setName(e.target.value)}
                            value={name}
                         />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Shop Image</label>
                        <input type="file" accept='image/*' placeholder='Enter Shop Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none
                         focus:ring-2 focus:ring-orange-500' onChange={handleImage}/>
                        {frontendImage &&  <div>
                            <img src={frontendImage} alt=""  className='w-full h-48 object-cover rounded-lg border'/>
                        </div>
                        }
                       
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                            <input type="text" placeholder='Enter Shop Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' 
                            onChange={(e) => setCity(e.target.value)} value={city} />

                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
                            <input type="text" placeholder='Enter Shop Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' 
                            onChange={(e) => setState(e.target.value)} value={state} />

                        </div>

                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                        <input type="text" placeholder='Enter Shop Address' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' 
                        onChange={(e) => setAddress(e.target.value)} value={address} />
                    </div>
                    <button className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 
                    hover:shadow-lg transition-all duration-200 cursor-pointer'>
                        Save
                    </button>
                </form>

            </div>


        </div>
    )
}

export default CreateEditShop