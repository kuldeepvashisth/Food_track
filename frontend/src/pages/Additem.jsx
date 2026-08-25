import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useState } from 'react';
import { setMyShopData } from '../redux/ownerSlice';
import axios from 'axios';
import { serverUrl } from '../config.js';



function Additem() {
    const navigate = useNavigate();
    // const { myShopData } = useSelector(state => state.user)
    const { myshopData } = useSelector(state => state.owner)
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [category, setCategory] = useState("")
    const [FoodType, setFoodType] = useState("veg") // Must match the backend enum
    const [error, setError] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const categories = [
         "snacks",
            "main course",
            "deserts",
            "Pizza",
            "Burgers",
            "South Indian",
            "North Indian",
            "chinese",
            "Fast food"
    ]
    const handleImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            setBackendImage(file)
            setFrontendImage(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault() //taki baar0 baar refresh na ho
        const cleanedName = name.trim()
        const alreadyExists = (myshopData?.items || []).some((item) => item.Name?.trim().toLowerCase() === cleanedName.toLowerCase())
        if (!cleanedName || !category || Number(price) <= 0) {
            setError("Please enter a food name, category, and a valid price.")
            return
        }
        if (alreadyExists) {
            setError(`“${cleanedName}” is already on your menu. Each food item name must be unique.`)
            return
        }
        setError("")
        setIsSaving(true)

        try {
            const formData = new FormData() // FormData :- ek class hoti hai js mai form ka data bhejne ke lie by using append
            formData.append("name", cleanedName)
            formData.append("price", price)
            formData.append("category", category)
            formData.append("foodType", FoodType)
            if (backendImage) {
                formData.append("image", backendImage)
            }
            const result = await axios.post(
                `${serverUrl}/api/item/add-item`,
                formData,
                {
                    withCredentials: true
                }
            );

            dispatch(setMyShopData(result.data));
            navigate('/')
        }
        catch (err) {
            setError(err.response?.data?.message || "Could not save this food item. Please try again.")
        } finally {
            setIsSaving(false)
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
                        Add Food Item
                    </div>
                </div>
                <form className='space-y-5' onSubmit={handleSubmit}>
                    {error && <div role='alert' className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>{error}</div>}
                     {/* Item Name */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                        <input required type="text" placeholder='Enter Item Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-500' onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>

                                    {/* Image */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                        <input type="file" accept='image/*' placeholder='Enter Item Image' className='w-full px-4 py-2 border rounded-lg focus:outline-none
                         focus:ring-2 focus:ring-orange-500' onChange={handleImage} />
                        {frontendImage && <div>
                            <img src={frontendImage} alt="" className='w-full h-48 object-cover rounded-lg border' />
                        </div>
                        }

                    </div>
                       {/* Food Category */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                        <select required className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e) => setCategory(e.target.value)} value={category}>
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Food Type */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Food Type</label>
                        <select className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e) => setFoodType(e.target.value)} value={FoodType}>
                            <option value="veg">Veg</option>
                            <option value="Non-veg">Non-Veg</option>
                        </select>
                    </div>

                                {/* Food price */}
                    
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                        <input required min="1" type="number" placeholder='0' className='w-full px-4 py-2 border rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-500' onChange={(e) => setPrice(e.target.value)}
                            value={price}
                         />
                    </div>


                    <button disabled={isSaving} className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 
                    hover:shadow-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'>
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </form>

            </div>


        </div>
    )
}

export default Additem
