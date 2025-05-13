import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

type GeolocationState = {
  latitude: number | null;
  longitude: number | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
  timestamp: number | null;
  getCurrentPosition: () => void;
};

export function useGeolocation(): GeolocationState {
  const [cachedPosition, setCachedPosition] = useLocalStorage<{
    latitude: number;
    longitude: number;
    timestamp: number;
  } | null>("geolocation", null);

  const [state, setState] = useState<GeolocationState>({
    latitude: cachedPosition?.latitude || null,
    longitude: cachedPosition?.longitude || null,
    error: null,
    isLoading: false,
    timestamp: cachedPosition?.timestamp || null,
    getCurrentPosition: () => {}
  });

  const getCurrentPosition = () => {
    setState((prevState) => ({ ...prevState, isLoading: true }));

    if (!navigator.geolocation) {
      setState((prevState) => ({
        ...prevState,
        error: {
          code: 0,
          message: "Geolocation is not supported by this browser.",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3
        } as GeolocationPositionError,
        isLoading: false
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp
        };

        setCachedPosition(newPosition);

        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
          timestamp: position.timestamp,
          getCurrentPosition
        });
      },
      (error) => {
        setState((prevState) => ({
          ...prevState,
          error,
          isLoading: false
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
      }
    );
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      getCurrentPosition
    }));

    // If we don't have a cached position, or it's older than 15 minutes, get a new one
    const fifteenMinutes = 15 * 60 * 1000;
    if (
      !cachedPosition ||
      (cachedPosition.timestamp &&
        Date.now() - cachedPosition.timestamp > fifteenMinutes)
    ) {
      getCurrentPosition();
    }
  }, []);

  return state;
}
