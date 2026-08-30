import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { IoLocationSharp, IoSearchOutline } from 'react-icons/io5'
import { TbCurrentLocation } from 'react-icons/tb'
import { useSelector } from 'react-redux';
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

import "leaflet/dist/leaflet.css"
function CheckOut() {
    const { location,address } = useSelector(state => state.map)
    // const {searcjLocation,setSearchLocation}=useState("")
    //  useEffect(()=>{
    //     setSearchLocation(address)
    //  },[address])
    return (
        <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
            <div className='absolute top-[20px] left-[20px] z-[10] cursor-pointer' onClick={() => navigate("/")}>
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
            </div>
            <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space y-6'>
                <h1 className='text-2xl font-bold text-gray-800 mb-2'> CheckOut</h1>

                <section>
                    <h2 className='text-lg font-semibold mb-2 flex items-center gap-2'>
                        < IoLocationSharp className='text-[#ff4d2d]' /> Delivery Location </h2>

                    <div className='flex gap-2 mb-3'>
                        <input type="text" className='flex-1 border border-gray-300 round-lg p-2 text-sm
                focus:outline-none focus:ring-2 focus:ring[#ff4d2d]' placeholder="Enter yOUR DELIVERY Address " value={address} />
                        <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex
                items-center justify-center'><IoSearchOutline size={24} /></button>
                        <button className='bg-blue-200 hover:bg-[#e64526] text-orange-800 px-3 py-2 rounded-lg flex
                items-center justify-center'> <TbCurrentLocation size={24} /></button>
                    </div>

                    <div className='rounded-xl border overflow-hidden'>
                        <div className='h-64 w-full flex items-center justify-center'>
                            <MapContainer className={"w-full h-full"}
                                center={[location?.latitude, location?.longitude]}
                                 zoom={16}
                                >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[location?.latitude, location?.longitude]}></Marker>
                            </MapContainer>
                        </div>
                    </div>

                </section>
            </div>
        </div>
    )
}

export default CheckOut