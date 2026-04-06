import { useState, useEffect } from 'react';
import { getMapPlaces, getPlaces } from '../api/places';
import NaverMap from '../components/map/NaverMap';
import CategoryFilter from '../components/map/CategoryFilter';
import SearchBar from '../components/map/SearchBar';
import PlaceCard from '../components/map/PlaceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function MapPage() {
  const [places, setPlaces] = useState([]);
  const [listPlaces, setListPlaces] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    getMapPlaces()
      .then((res) => setPlaces(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadList();
  }, [category, keyword]);

  const loadList = () => {
    getPlaces({ page: 0, size: 50, category: category || undefined, keyword: keyword || undefined })
      .then((res) => setListPlaces(res.data.content || []))
      .catch(() => setListPlaces([]));
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSelectedId(null);
  };

  const filteredMapPlaces = category
    ? places.filter((p) => p.category === category)
    : places;

  return (
    <div className="h-[calc(100vh-64px)] flex relative">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-[380px]' : 'w-0'
        } transition-all duration-300 bg-pet-cream border-r border-pet-gray overflow-hidden flex-shrink-0`}
      >
        <div className="w-[380px] h-full flex flex-col p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-pet-dark-brown mb-3">🐾 장소 찾기</h2>
            <SearchBar onSearch={setKeyword} />
          </div>
          <div className="mb-4">
            <CategoryFilter selected={category} onChange={handleCategoryChange} />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {listPlaces.length === 0 ? (
              <div className="text-center py-8 text-pet-brown/50 text-sm">
                검색 결과가 없습니다
              </div>
            ) : (
              listPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  selected={selectedId === place.id}
                  onClick={() => setSelectedId(place.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute left-[380px] top-4 z-10 bg-white shadow-md rounded-r-lg p-2 text-pet-brown hover:bg-pet-peach transition-colors"
        style={{ left: sidebarOpen ? '380px' : '0' }}
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* Map */}
      <div className="flex-1">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <NaverMap
            places={filteredMapPlaces}
            selectedId={selectedId}
            onMarkerClick={setSelectedId}
          />
        )}
      </div>
    </div>
  );
}
