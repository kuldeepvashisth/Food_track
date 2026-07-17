import { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../config.js';

function useGetCurrentUser() {
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/user/current`, {
                    withCredentials: true,
                });
                console.log('Current user:', response.data.user);
            } catch (error) {
                console.error('Unable to get current user:', error.response?.data || error.message);
            }
        };

        fetchUser();
    }, []);
}

export default useGetCurrentUser;
