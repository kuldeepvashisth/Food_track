import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { serverUrl } from '../config.js';
import { setMyOrders } from '../redux/UserSlice.js';
import { useSelector } from 'react-redux';
function useGetMyOrders() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
     const {userData}=useSelector(state=>state.user)
    useEffect(() => {
        const role = String(userData?.role || '').trim().toLowerCase();
        if (!userData || !['user', 'owner', 'deliveryboy'].includes(role)) {
            setIsLoading(false);
            return;
        }

        const fetchorder = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/order/my-orders`, { withCredentials: true });
                dispatch(setMyOrders(result.data ?? null));
            } catch (error) {
                if (error.response?.status === 404) {
                    dispatch(setMyOrders(null));
                } else {
                    console.error('Error in get my orders in frontend :', error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchorder();

        const refreshInterval = window.setInterval(fetchorder, 5000);

        return () => window.clearInterval(refreshInterval);
    }, [userData]);

    return { isLoading };
}

export default useGetMyOrders;