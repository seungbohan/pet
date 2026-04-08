import { useState, useEffect, useCallback } from 'react';
import useToastStore from '../store/toastStore';

/**
 * useGeolocation - GPS location detection hook
 *
 * Auto-detects user location on mount (if browser supports geolocation).
 * Provides a manual `requestLocation` trigger for the GPS button.
 *
 * @returns {{ userLocation, gpsLoading, gpsReady, requestLocation }}
 */
export default function useGeolocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsReady, setGpsReady] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  /* Auto-detect on mount */
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsReady(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsReady(true);
      },
      () => {
        setGpsReady(true);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  /* Manual GPS request (button click) */
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      addToast('이 브라우저에서는 위치 서비스를 지원하지 않습니다.', 'warning');
      return null;
    }

    setGpsLoading(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setGpsLoading(false);
          resolve(loc);
        },
        (error) => {
          setGpsLoading(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              addToast('위치 접근 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.', 'warning');
              break;
            case error.POSITION_UNAVAILABLE:
              addToast('위치 정보를 사용할 수 없습니다.', 'warning');
              break;
            case error.TIMEOUT:
              addToast('위치 요청 시간이 초과되었습니다.', 'warning');
              break;
            default:
              addToast('알 수 없는 오류가 발생했습니다.', 'error');
          }
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, [addToast]);

  return { userLocation, gpsLoading, gpsReady, requestLocation };
}
