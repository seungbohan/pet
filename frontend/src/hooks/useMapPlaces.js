import { useState, useEffect } from 'react';
import { getMapPlaces, getPlaces } from '../api/places';

/**
 * useMapPlaces - Place data fetching and filtering hook
 *
 * Fetches all map places on mount, then derives a filtered/sorted list
 * based on category, keyword, areacode, and user location.
 *
 * @param {object|null} userLocation  - { lat, lng } or null
 * @returns place data + filter state + setters
 */
export default function useMapPlaces(userLocation) {
  const [places, setPlaces] = useState([]);
  const [listPlaces, setListPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [areacode, setAreacode] = useState('');

  /* Fetch all map places on mount */
  useEffect(() => {
    getMapPlaces()
      .then((res) => setPlaces(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Distance-sort helper */
  const distanceSorted = (placeList, loc) => {
    if (!loc) return placeList.slice(0, 50);
    const dist = (p) =>
      Math.pow((p.mapy || 0) - loc.lat, 2) + Math.pow((p.mapx || 0) - loc.lng, 2);
    return [...placeList]
      .filter((p) => p.mapx && p.mapy)
      .sort((a, b) => dist(a) - dist(b))
      .slice(0, 50);
  };

  /* When all places load and we have user location, sort by distance */
  useEffect(() => {
    if (places.length === 0) return;
    setListPlaces(distanceSorted(places, userLocation));
  }, [places, userLocation]);

  /* React to filter changes */
  useEffect(() => {
    if (!category && !keyword && !areacode) {
      if (places.length > 0 && userLocation) {
        setListPlaces(distanceSorted(places, userLocation));
      }
      return;
    }
    const params = {
      page: 0,
      size: 50,
      category: category || undefined,
      keyword: keyword || undefined,
      areacode: areacode || undefined,
    };
    getPlaces(params)
      .then((res) => setListPlaces(res.data.content || []))
      .catch(() => setListPlaces([]));
  }, [category, keyword, areacode]);

  /**
   * Re-sort the list by distance from a given center point.
   * Used when the user pans the map and clicks "현재 위치 장소 보기".
   */
  const refreshByCenter = (lat, lng) => {
    if (places.length === 0) return;
    setListPlaces(distanceSorted(places, { lat, lng }));
  };

  return {
    places,
    listPlaces,
    loading,
    category,
    setCategory,
    keyword,
    setKeyword,
    areacode,
    setAreacode,
    refreshByCenter,
  };
}
