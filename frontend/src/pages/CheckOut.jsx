import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { IoLocationSharp, IoSearchOutline } from 'react-icons/io5'
import { TbCurrentLocation } from 'react-icons/tb'
import { useSelector } from 'react-redux';
import { addMyOrder } from '../redux/UserSlice.js';
// import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { useDispatch } from 'react-redux';
import { setLocation } from '../redux/mapSlice';
import { setAddress } from '../redux/mapSlice';
import { useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css"
import {MdDeliveryDining} from 'react-icons/md'
import {MdPayment} from 'react-icons/md'
import axios from 'axios';

import {FaCreditCard} from 'react-icons/fa'
import { serverUrl } from '../config.js';

const apiKey = import.meta.env.VITE_GEOAPIKEY;


function CheckOut() { 
     
    const { location, address } = useSelector(state => state.map)
    const {cartItems,totalAmount} = useSelector((state) => state.user);
    
    const [addressInput, setAddressInput] = useState(address || '');
    const [PaymentMethod, setPaymentMethod] = useState("cod")
    const [orderError, setOrderError] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const deliveryFee=totalAmount>500 ?0 :40;
    const AmountWithDeliveryFee=totalAmount+deliveryFee


    const handleMarkerDrag = (e) => {
        const { lat, lng } = e.target.getLatLng();
        dispatch(setLocation({ latitude: lat, longitude: lng }));
        console.log("New marker position:", lat, lng);
        // You can update the state or perform any other actions with the new position here
        getAddressFromCoordinates(lat, lng)

    }

    function RecenterLocations({ location }) {
        const map = useMap();
        // useEffect(() => {
        //     if (location?.latitude && location?.longitude) {
        //         map.setView(
        //             [location.latitude, location.longitude],
        //             map.getZoom()
        //         );
        //     }
        // }, [location, map]);
        map.setView([location?.latitude, location?.longitude], 16, map.getZoom());

        return null;
    }

    const getAddressFromCoordinates = async (latitude, longitude) => {
        try {


            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}
                            &format=json&apiKey=${apiKey}`);
            // console.log("Address response:", response.data);
            console.log(result?.data?.results?.[0].address_line2)
            dispatch(setAddress(result?.data?.results?.[0].address_line2));
        }
        catch (err) {
            console.error("Error fetching address:", err);
            return null;
        }
    }
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                dispatch(setLocation({ latitude, longitude }));
                getAddressFromCoordinates(latitude, longitude);
            }, (error) => {
                console.error("Error getting current location:", error);
            });
        }
    }



    const getLatLangByAddress = async () => {
        try {
            const result = await axios.get(
                `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`
            );

            const location = result.data.features[0]?.properties;

            if (!location) {
                console.log("Location not found");
                return;
            }

            const { lat, lon } = location;

            console.log("Latitude:", lat);
            console.log("Longitude:", lon);

            // Store coordinates in Redux
            dispatch(setLocation({
                latitude: lat,
                longitude: lon
            }));

        } catch (error) {
            console.error("Error getting coordinates by text:", error);
        }
    };

    const handlePlaceOrder=async () =>{
        if (cartItems.length === 0) {
            setOrderError('Your cart is empty. Add an item before placing the order.');
            return;
        }

        if (!addressInput && !address) {
            setOrderError('Please enter a delivery address.');
            return;
        }

        setOrderError('');
        setIsPlacingOrder(true);
        try{
             const result = await axios.post(
                     `${serverUrl}/api/order/place-order`,{
                    paymentMethod: PaymentMethod,
                    deliveryAddress:{
                        text: addressInput || address,
                        latitude:location?.latitude,
                        longitude:location?.longitude
                    },
                    totalAmount,
                    cartItems
        },{withCredentials:true});
        dispatch(addMyOrder(result.data))
        navigate('/order-placed');
        }
        catch(err){
            setOrderError(err.response?.data?.message || 'Unable to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    }

    return (
        <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
            <div className='absolute top-[20px] left-[20px] z-[10] cursor-pointer' onClick={() => navigate("/")}>
                {/* Arrow back symbol */}
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
            </div>
            <div className=' flex flex-col gap-5 w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space y-6'>
                <h1 className='text-2xl font-bold text-gray-800 mb-2'> CheckOut</h1>

                <section>
                    {/* h1 Delivery Location */}
                    <h2 className='text-lg font-semibold mb-2 flex items-center gap-2'>
                        < IoLocationSharp className='text-[#ff4d2d]' /> Delivery Location </h2>

                    <div className='flex gap-2 mb-3'>

                        {/* Input for Address location */}

                        <input type="text" className='flex-1 border border-gray-300 round-lg p-2 text-sm
                focus:outline-none focus:ring-2 focus:ring[#ff4d2d]' placeholder="Enter yOUR DELIVERY Address " value={addressInput} onChange={(e) => setAddressInput(e.target.value)} />
                        <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex
                items-center justify-center' onClick={getLatLangByAddress} ><IoSearchOutline size={24} /></button>
                        <button className='bg-blue-200 hover:bg-[#e64526] text-orange-800 px-3 py-2 rounded-lg flex
                items-center justify-center' onClick={getCurrentLocation}> <TbCurrentLocation size={24} /></button>
                    </div>
                    {/* Map */}
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
                                <RecenterLocations location={location} />
                                <Marker position={[location?.latitude, location?.longitude]}
                                    draggable eventHandlers={{ dragend: (e) => handleMarkerDrag(e) }} />
                                {/* yha e is the event object that contains information about the drag event, including the new position of the marker. You can use this information to update the state or perform any other actions you need when the marker is dragged. */}
                            </MapContainer>
                        </div>
                    </div>

                </section>

                    {/* Payment Method Section */}
                <section>
                    <h2 className='text-lg font semibold mb-3 text-gray-800'>Payment Method</h2>
                    <div className='grid grid-cols-2 gap-4'>
                       {/* cash on Delivery */}
                       
                        <div className={`flex min-w-0 max-w-full items-center gap-3 overflow-x-auto rounded-xl border-2 p-4 text-left transition
                        ${PaymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-200 shadow" : "border-gray-200 bg-white hover:border-gray-300"}`}
                            onClick={() => setPaymentMethod("cod")}>
                            <MdDeliveryDining className='text-2xl' />
                            <span className='font-medium'>Cash on Delivery</span>
                            <div>
                                <p className='text-sm text-gray-800'>Pay with cash upon delivery.</p>
                              
                                 
                            </div>

                        </div>

                              {/* Online */}

                        <div className={`min-w-0 overflow-hidden rounded-xl border-2 p-2 text-left transition
                        ${PaymentMethod === "online" ? "border-blue-500 bg-blue-100 shadow" : "border-2 border-gray-200 bg-white hover:border-gray-300"}`}
                            onClick={() => setPaymentMethod("online")}>
                            <div className='flex w-full min-w-0 justify-content items-center gap-2 overflow-hidden'>
                               <div className='flex w-full min-w-0  gap-2 overflow-hidden'>
                                <MdPayment className='shrink-0 text-xl' />
                                <span className='shrink-0 text-sm font-medium'>Online Payment</span>
                               </div>
                              <div className='flex w-full min-w-0 items-center gap-2 overflow-hidden'> 
                                {/* <p  className='shrink-0 text-[10px] text-gray-500'>Pay securely online.</p> */}
                                <FaCreditCard className='rounded-xl bg-blue-200 p-1 text-lg' size={32} />
                                <p className='min-w-0 truncate text-[11px] font-medium text-gray-800'>UPI / Credit Card / Debit Card</p>
                           
                                </div>
                             </div>
                        </div>


                    </div>
                </section>

                            <section>
                                <h2 className='text-lg font-semibold mb-3'>Order Summary</h2>
                                <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
                                    {cartItems.map((item,index)=>(
                                         <div key={index} className='flex justify-between text-sm text-gray-700'>
                                            <span className='font-semibold' >{item.name} x {item.quantity}</span>
                                            <span className='font-semibold'>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <hr className='border-red-400 my-2'/>
                                    <div className='flex justify-between font-medium text-gray-800'>
                                        <span>SubTotal</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                    <div className='flex justify-between font-medium text-gray-800'>
                                          <span>Delivery Fee</span>
                                    <span>₹{deliveryFee===0?"Free" : deliveryFee}</span>
                                    </div>

                                    <hr className=' mb-3 font-bold text-orange-900'/>
                                    <div className='flex justify-between font-medium text-gray-800'>
                                          <span>Total Amount</span>
                                    <span className='font-bold text-[#ff4d2d]'>₹{AmountWithDeliveryFee}</span>
                                    </div>
                                </div>
                            </section>
                            {orderError && <p className='text-sm font-medium text-red-600'>{orderError}</p>}
                            <button className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3
                            rounded-xl font-semibold disabled:cursor-not-allowed disabled:opacity-60' onClick={handlePlaceOrder} disabled={isPlacingOrder}>{isPlacingOrder ? 'Placing Order...' : PaymentMethod=="cod"?"Place Order" : "Pay Now"}</button>
                          

            </div>
        </div>
    )
}

export default CheckOut