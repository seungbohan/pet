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
    <div className="h-[calc(100vh-64px)] flex relative overflow-hidden">
      {/* ===== Sidebar ===== */}
      {/* Desktop sidebar */}
      <div
        className={`hidden md:block transition-all duration-300 ease-in-out flex-shrink-0 ${
          sidebarOpen ? 'w-[400px]' : 'w-0'
        }`}
      >
        <div className="w-[400px] h-full flex flex-col bg-white/80 backdrop-blur-xl border-r border-pet-gray/60">
          {/* Header */}
          <div className="p-5 pb-0">
            <h2 className="text-lg font-bold text-pet-dark-brown mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-pet-orange to-pet-pink rounded-lg flex items-center justify-center text-white text-sm shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              장소 찾기
            </h2>

            {/* Search bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-pet-brown/40">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <SearchBar onSearch={setKeyword} className="w-full pl-10 pr-4 py-2.5 rounded-full bg-pet-cream/80 border border-pet-gray/50 text-sm placeholder:text-pet-brown/40 focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/20 transition-all duration-200" />
            </div>

            {/* Category filter */}
            <div className="mb-4 -mx-5 px-5 overflow-x-auto scrollbar-hide">
              <CategoryFilter selected={category} onChange={handleCategoryChange} />
            </div>
          </div>

          {/* Place list */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
            {listPlaces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-4xl mb-3">&#x1F50D;</div>
                <p className="text-sm text-pet-brown/50">검색 결과가 없습니다</p>
                <p className="text-xs text-pet-brown/30 mt-1">다른 키워드로 검색해보세요</p>
              </div>
            ) : (
              listPlaces.map((place) => (
                <div
                  key={place.id}
                  className={`rounded-xl transition-all duration-200 cursor-pointer ${
                    selectedId === place.id
                      ? 'bg-pet-orange/10 border-l-4 border-pet-orange shadow-sm'
                      : 'hover:bg-pet-cream/80 border-l-4 border-transparent'
                  }`}
                >
                  <PlaceCard
                    place={place}
                    selected={selectedId === place.id}
                    onClick={() => setSelectedId(place.id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Desktop sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden md:flex absolute z-20 top-1/2 -translate-y-1/2 w-6 h-16 bg-white/90 backdrop-blur shadow-md rounded-r-lg items-center justify-center text-pet-brown/60 hover:text-pet-orange hover:bg-white transition-all duration-200"
        style={{ left: sidebarOpen ? '400px' : '0' }}
        aria-label={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* ===== Mobile bottom sheet ===== */}
      <div className="md:hidden absolute inset-x-0 bottom-0 z-30">
        {/* Drag handle area to toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex justify-center pt-2 pb-1 bg-white/90 backdrop-blur-xl rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          aria-label="장소 목록 토글"
        >
          <div className="w-10 h-1.5 rounded-full bg-pet-brown/20" />
        </button>

        <div
          className={`bg-white/95 backdrop-blur-xl transition-all duration-300 ease-in-out overflow-hidden ${
            sidebarOpen ? 'max-h-[55vh]' : 'max-h-0'
          }`}
        >
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(55vh-20px)]">
            {/* Mobile search */}
            <SearchBar onSearch={setKeyword} />

            {/* Mobile categories */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <CategoryFilter selected={category} onChange={handleCategoryChange} />
            </div>

            {/* Mobile place list */}
            <div className="space-y-2">
              {listPlaces.length === 0 ? (
                <div className="text-center py-8 text-pet-brown/50 text-sm">
                  검색 결과가 없습니다
                </div>
              ) : (
                listPlaces.slice(0, 20).map((place) => (
                  <div
                    key={place.id}
                    className={`rounded-xl transition-all duration-200 ${
                      selectedId === place.id
                        ? 'bg-pet-orange/10 border-l-4 border-pet-orange'
                        : 'border-l-4 border-transparent'
                    }`}
                  >
                    <PlaceCard
                      place={place}
                      selected={selectedId === place.id}
                      onClick={() => setSelectedId(place.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Map ===== */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-pet-cream">
            <LoadingSpinner />
          </div>
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
