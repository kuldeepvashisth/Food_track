import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../config.js';
import { setShopInMyCity } from '../redux/UserSlice.js';
import { useDispatch, useSelector } from 'react-redux';

function UseGetShopbyCity() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const currentCity = useSelector((state) => state.user.currentCity);
    useEffect(() => {
        const fetchShops = async () => {
            if (!currentCity) {
                dispatch(setShopInMyCity([]));
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-nearby-shop/${encodeURIComponent(currentCity)}`, {
                    withCredentials: true,
                });

                dispatch(setShopInMyCity(Array.isArray(result.data) ? result.data : []));
            } catch (error) {
                console.error('Unable to get nearby shops:', error.response?.data || error.message);
                dispatch(setShopInMyCity([]));
            } finally {
                setIsLoading(false);
            }
        };

        fetchShops();
    }, [currentCity, dispatch]);

    return { isLoading };
}
               
export default UseGetShopbyCity;
