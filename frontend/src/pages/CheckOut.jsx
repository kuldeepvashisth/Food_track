import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { IoLocationSharp, IoSearchOutline } from 'react-icons/io5'
import { TbCurrentLocation } from 'react-icons/tb'
import { useSelector } from 'react-redux';
// import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { useDispatch } from 'react-redux';
import { setLocation } from '../redux/mapSlice';
import { setAddress } from '../redux/mapSlice';
import { useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css"
import axios from 'axios';
     const apiKey = import.meta.env.VITE_GEOAPIKEY;

function CheckOut() {
    const { location,address } = useSelector(state => state.map)
    const [addressInput, setAddressInput] = useState(address || '');
    const dispatch = useDispatch();
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
    map.setView([location?.latitude, location?.longitude],16,map.getZoom());

    return null;
}

const getAddressFromCoordinates = async (latitude, longitude) => {
    try{
   
            
    const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}
                            &format=json&apiKey=${apiKey}`);
                    // console.log("Address response:", response.data);
                    console.log (result?.data?.results?.[0].address_line2)
                    dispatch(setAddress(result?.data?.results?.[0].address_line2));
    }
    catch(err){
        console.error("Error fetching address:", err);
        return null;    
    }
}
     const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async(position) => {
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

    return (
        <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
            <div className='absolute top-[20px] left-[20px] z-[10] cursor-pointer' onClick={() => navigate("/")}>
                {/* Arrow back symbol */}
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
            </div>
            <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space y-6'>
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
            </div>
        </div>
    )
}

export default CheckOut