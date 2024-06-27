import { INITIAL_CENTER } from '@/app/(route)/map/_components/mapSection';
import { Coordinates } from '@/types/map';
import { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'currentLocation';

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<Coordinates>(() => {
    const cachedLocation = typeof window !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_KEY);
    return cachedLocation ? JSON.parse(cachedLocation) : INITIAL_CENTER;
  });
  const [error, setError] = useState('');

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    const newLocation: Coordinates = [latitude, longitude];

    setLocation(newLocation);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLocation));
  };

  const handleError = (err: GeolocationPositionError) => {
    setLocation([...INITIAL_CENTER]);
    setError('Unable to retrieve location.');
  };

  // 현재위치 갱신 함수
  const refreshLocation = () => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError('Geolocation is not supported.');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    geolocation.getCurrentPosition(handleSuccess, handleError, options);
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return { location, error, refreshLocation };
};
