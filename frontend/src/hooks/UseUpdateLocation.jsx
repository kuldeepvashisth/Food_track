import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLocation } from '../redux/mapSlice.js';
import { serverUrl } from '../config.js';
import { useSelector } from 'react-redux';

function useUpdateLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData?._id || !navigator.geolocation) return undefined;

    const updateLocation = async ({ latitude, longitude }) => {
      dispatch(setLocation({ latitude, longitude }));
      try {
        await axios.post(
          `${serverUrl}/api/user/update-location`,
          { latitude, longitude },
          { withCredentials: true }
        );
      } catch (error) {
        console.error('Unable to update user location:', error);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => updateLocation(coords),
      (error) => console.error('Unable to read user location:', error),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [dispatch, userData?._id]);

  return {};
}



export default useUpdateLocation;
