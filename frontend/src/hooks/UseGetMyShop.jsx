import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { serverUrl } from '../config.js';
import { setMyShopData } from '../redux/ownerSlice.js';
import { useSelector } from 'react-redux';
function useGetMyShop() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
     const {userData}=useSelector(state=>state.user)
    useEffect(() => {
        const fetchShop = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-my`, { withCredentials: true });
                dispatch(setMyShopData(result.data ?? null));
            } catch (error) {
                if (error.response?.status === 404) {
                    dispatch(setMyShopData(null));
                } else {
                    console.error('Error in get my shop in frontend :', error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchShop();
    }, [userData]);

    return { isLoading };
}

export default useGetMyShop;