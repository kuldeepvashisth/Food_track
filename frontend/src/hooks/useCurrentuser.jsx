import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../config.js';
import { setUserData } from '../redux/UserSlice.js';
import { useDispatch } from 'react-redux';

function useGetCurrentUser() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/user/current`, {
                    withCredentials: true,
                });

                const currentUser = response.data?.user || response.data;
                console.log('Current user:', currentUser);
                dispatch(setUserData(currentUser || null));
            } catch (error) {
                console.error('Unable to get current user:', error.response?.data || error.message);
                dispatch(setUserData(null));
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [dispatch]);

    return { isLoading };
}

export default useGetCurrentUser;
