import { useEffect, useRef, useCallback } from 'react';

export default function NaverMap({
  places = [],
  selectedId,
  onMarkerClick,
  userLocation,
  center,
  zoom,
  onMapReady,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const placesRef = useRef(places);

  placesRef.current = places;

  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initMap();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=ufwzhw6j2z&submodules=clustering';
    script.async = true;
    script.onload = () => initMap();
    document.head.appendChild(script);
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(36.5, 127.5),
      zoom: 7,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    });
    mapInstanceRef.current = map;

    // Notify parent that map is ready
    onMapReady?.(map);

    // Update visible markers on map move/zoom
    window.naver.maps.Event.addListener(map, 'idle', () => {
      updateVisibleMarkers();
    });

    updateVisibleMarkers();
  };

  const updateVisibleMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.naver) return;

    const bounds = map.getBounds();
    const currentZoom = map.getZoom();

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Filter places within current bounds
    const visiblePlaces = placesRef.current.filter((p) => {
      if (!p.mapx || !p.mapy) return false;
      return bounds.hasPoint(new window.naver.maps.LatLng(p.mapy, p.mapx));
    });

    // Limit markers based on zoom level
    const maxMarkers = currentZoom >= 13 ? 200 : currentZoom >= 10 ? 100 : 50;
    const toRender = visiblePlaces.slice(0, maxMarkers);

    toRender.forEach((place) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(place.mapy, place.mapx),
        map: map,
        title: place.title,
        icon: {
          content: `<div style="background:#FF8C42;color:white;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);border:2px solid white;">${place.title.length > 8 ? place.title.substring(0, 8) + '..' : place.title}</div>`,
          anchor: new window.naver.maps.Point(15, 15),
        },
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        onMarkerClick?.(place.id);
      });

      markersRef.current.push(marker);
    });
  }, [onMarkerClick]);

  // Update when places change
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateVisibleMarkers();
    }
  }, [places, updateVisibleMarkers]);

  // Pan to selected place
  useEffect(() => {
    if (selectedId && mapInstanceRef.current) {
      const place = places.find((p) => p.id === selectedId);
      if (place && place.mapx && place.mapy) {
        mapInstanceRef.current.setCenter(
          new window.naver.maps.LatLng(place.mapy, place.mapx)
        );
        if (mapInstanceRef.current.getZoom() < 13) {
          mapInstanceRef.current.setZoom(15);
        }
      }
    }
  }, [selectedId, places]);

  // Update map center/zoom when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !center || !window.naver) return;
    map.setCenter(new window.naver.maps.LatLng(center.lat, center.lng));
    if (zoom) {
      map.setZoom(zoom);
    }
  }, [center, zoom]);

  // Manage user location marker (blue pulsing dot)
  useEffect(() => {
    const map = mapInstanceRef.current;

    // Remove old user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }

    if (!map || !userLocation || !window.naver) return;

    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(userLocation.lat, userLocation.lng),
      map: map,
      icon: {
        content: [
          '<div style="position:relative;width:22px;height:22px;">',
          '  <div style="position:absolute;inset:0;background:rgba(66,133,244,0.15);border-radius:50%;animation:userPulse 2s ease-in-out infinite;"></div>',
          '  <div style="position:absolute;top:3px;left:3px;width:16px;height:16px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 0 0 2px rgba(66,133,244,0.3);"></div>',
          '</div>',
        ].join(''),
        anchor: new window.naver.maps.Point(11, 11),
      },
      zIndex: 1000,
    });

    userMarkerRef.current = marker;
  }, [userLocation]);

  return <div ref={mapRef} className="w-full h-full" />;
}
