import { useEffect, useRef, useCallback } from 'react';

const categoryMarkerColors = {
  CAFE: '#D97706',
  RESTAURANT: '#DC2626',
  ACCOMMODATION: '#2563EB',
  PARK: '#16A34A',
  HOSPITAL: '#EC4899',
  TOURIST: '#0891B2',
  LEISURE: '#9333EA',
  CULTURE: '#4F46E5',
  SHOPPING: '#EA580C',
  OTHER: '#6B7280',
};

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
  const clusterRef = useRef(null);
  const userMarkerRef = useRef(null);
  const placesRef = useRef(places);

  placesRef.current = places;

  useEffect(() => {
    const loadClusterScript = (callback) => {
      if (window.MarkerClustering) {
        callback();
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://navermaps.github.io/maps.js.ncp/docs/js/MarkerClustering.js';
      s.async = true;
      s.onload = callback;
      document.head.appendChild(s);
    };

    if (window.naver && window.naver.maps) {
      loadClusterScript(() => initMap());
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=ufwzhw6j2z&submodules=clustering';
    script.async = true;
    script.onload = () => loadClusterScript(() => initMap());
    document.head.appendChild(script);
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(36.5, 127.5),
      zoom: 7,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    // Notify parent that map is ready
    onMapReady?.(map);

    updateVisibleMarkers();
  };

  const updateVisibleMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.naver) return;

    // Clear old cluster and markers
    if (clusterRef.current) {
      clusterRef.current.setMap(null);
      clusterRef.current = null;
    }
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const allMarkers = placesRef.current
      .filter((p) => p.mapx && p.mapy)
      .map((place) => {
        const color = categoryMarkerColors[place.category] || '#FF8C42';
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(place.mapy, place.mapx),
          title: place.title,
          icon: {
            content: `<div style="background:${color};color:white;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);border:2px solid white;">${place.title.length > 8 ? place.title.substring(0, 8) + '..' : place.title}</div>`,
            anchor: new window.naver.maps.Point(15, 15),
          },
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          onMarkerClick?.(place.id);
        });

        return marker;
      });

    markersRef.current = allMarkers;

    // Cluster icon generator
    const clusterIcon = (count) => ({
      content: `<div style="
        width:${count >= 100 ? 52 : count >= 10 ? 44 : 38}px;
        height:${count >= 100 ? 52 : count >= 10 ? 44 : 38}px;
        background:${count >= 100 ? '#DC2626' : count >= 10 ? '#F59E0B' : '#3B82F6'};
        color:white;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:${count >= 100 ? 15 : 13}px;
        font-weight:bold;
        box-shadow:0 3px 10px rgba(0,0,0,0.3);
        border:3px solid white;
      ">${count}</div>`,
      anchor: new window.naver.maps.Point(
        (count >= 100 ? 52 : count >= 10 ? 44 : 38) / 2,
        (count >= 100 ? 52 : count >= 10 ? 44 : 38) / 2
      ),
    });

    const cluster = new window.MarkerClustering({
      map: map,
      markers: allMarkers,
      minClusterSize: 2,
      maxZoom: 16,
      gridSize: 120,
      icons: [clusterIcon(1)],
      indexGenerator: [1],
      stylingFunction: (clusterMarker, count) => {
        const icon = clusterIcon(count);
        clusterMarker.setIcon(icon);
      },
      onClusterClick: (cluster) => {
        const clusterBounds = cluster.getBounds();
        map.fitBounds(clusterBounds, { top: 50, right: 50, bottom: 50, left: 50 });
      },
    });

    clusterRef.current = cluster;
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
