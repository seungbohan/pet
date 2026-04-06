import { useEffect, useRef, useCallback } from 'react';

export default function NaverMap({ places = [], selectedId, onMarkerClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initMap();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=ufwzhw6j2z';
    script.async = true;
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.978),
      zoom: 7,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    });
    mapInstanceRef.current = map;
    updateMarkers(places);
  };

  const updateMarkers = useCallback((newPlaces) => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (!mapInstanceRef.current || !window.naver) return;

    newPlaces.forEach((place) => {
      if (!place.mapx || !place.mapy) return;
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(place.mapy, place.mapx),
        map: mapInstanceRef.current,
        title: place.title,
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        onMarkerClick?.(place.id);
      });

      markersRef.current.push(marker);
    });
  }, [onMarkerClick]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers(places);
    }
  }, [places, updateMarkers]);

  useEffect(() => {
    if (selectedId && mapInstanceRef.current) {
      const place = places.find((p) => p.id === selectedId);
      if (place && place.mapx && place.mapy) {
        mapInstanceRef.current.setCenter(
          new window.naver.maps.LatLng(place.mapy, place.mapx)
        );
        mapInstanceRef.current.setZoom(15);
      }
    }
  }, [selectedId, places]);

  return <div ref={mapRef} className="w-full h-full" />;
}
