import { useEffect, useState } from 'react';
import axios from 'axios';
import { setcurrentAddress, setcurrentCity, setcurrentState } from '../redux/UserSlice.js';
import { useDispatch } from 'react-redux';

function useGetCity() {
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLoading(false);
      return;
    }

    const getCity = async (position) => {
      try {
        if (!apiKey) return;
        const { latitude, longitude } = position.coords;
        const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`);
        const place = response.data?.results?.[0];
        dispatch(setcurrentCity(place?.city || place?.county || null));
        dispatch(setcurrentState(place?.state || null));
        dispatch(setcurrentAddress(place?.address_line2 || place?.address_line1 || null));
      } catch (error) {
        console.error('Unable to get current city:', error);
      } finally {
        setIsLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(getCity, () => setIsLoading(false), { timeout: 10000, maximumAge: 300000 });
  }, [apiKey, dispatch]);

  return { isLoading };
}

export default useGetCity;
