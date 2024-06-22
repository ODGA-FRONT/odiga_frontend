import { INITIAL_CENTER } from '@/app/(route)/map/_components/mapSection';
import { Coordinates } from '@/types/map';
import { useEffect, useState } from 'react';

export const useCurrentLocation = (options = {}) => {
  const [location, setLocation] = useState<Coordinates>();
  const [error, setError] = useState('');

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;

    setLocation([latitude, longitude]);
  };

  const handleError = (err: GeolocationPositionError) => {
    setLocation([...INITIAL_CENTER]);
  };

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError('Geolocation is not supported.');
      return;
    }

    geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, [options]);

  return { location, error };
};
