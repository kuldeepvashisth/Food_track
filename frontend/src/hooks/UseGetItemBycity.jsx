import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../config.js';
import { setShopInMyCity, setItemsInMyCity } from '../redux/UserSlice.js';
import { useDispatch, useSelector } from 'react-redux';

function UseGetItemByCity() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const currentCity = useSelector((state) => state.user.currentCity);
    useEffect(() => {
        const fetchItems = async () => {
            if (!currentCity) {
                dispatch(setShopInMyCity([]));
                dispatch(setItemsInMyCity([]));
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-items-by-city/${encodeURIComponent(currentCity)}`, {
                    withCredentials: true,
                });
                
                dispatch(setShopInMyCity(result.data?.shops || []));
                dispatch(setItemsInMyCity(result.data?.items || []));
            } catch (error) {
                console.error('Unable to get items in the city:', error.response?.data || error.message);
                dispatch(setShopInMyCity([]));
                dispatch(setItemsInMyCity([]));
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [currentCity, dispatch]);

    return { isLoading };
}
               
export default UseGetItemByCity;
