import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getPopularPlaces, getSubmittedPlaces } from '../api/places';
import NaverMap from '../components/map/NaverMap';
import PlaceDetail from '../components/map/PlaceDetail';
import SubmitPlaceModal from '../components/map/SubmitPlaceModal';
import PopularRanking from '../components/map/PopularRanking';
import RecentSubmissions from '../components/map/RecentSubmissions';
import RegionSelector from '../components/map/RegionSelector';
import ConfirmModal from '../components/common/ConfirmModal';
import SEOHead from '../components/common/SEOHead';
import useAuthStore from '../store/authStore';
import useGeolocation from '../hooks/useGeolocation';
import useMapPlaces from '../hooks/useMapPlaces';
import usePlaceDetail from '../hooks/usePlaceDetail';
import { categories, categoryColors, categoryLabels } from '../constants/categories';
import { regionCenters } from '../constants/regions';
import { useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Bottom sheet constants (mobile)                                    */
/* ------------------------------------------------------------------ */
const SHEET_PEEK = 80;
const SHEET_HALF = 50;
const SHEET_FULL = 90;

/* ------------------------------------------------------------------ */
/*  MapPage - main landing page                                        */
/* ------------------------------------------------------------------ */
export default function MapPage() {
  /* --- Custom hooks --- */
  const { userLocation, gpsLoading, gpsReady, requestLocation } = useGeolocation();
  const {
    places, listPlaces, loading,
    category, setCategory,
    keyword, setKeyword,
    areacode, setAreacode,
    refreshByCenter,
  } = useMapPlaces(userLocation);

  /* --- Local UI state --- */
  const [selectedId, setSelectedId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(null);
  const [sheetState, setSheetState] = useState('half');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  const mapInstanceRef = useRef(null);
  const sheetRef = useRef(null);
  const touchStartY = useRef(0);

  const { isAuthenticated, user, logout } = useAuthStore();

  /* --- Place detail hook --- */
  const detail = usePlaceDetail(selectedId);

  /* --- Set initial map center from GPS --- */
  useEffect(() => {
    if (userLocation && !mapCenter) {
      setMapCenter(userLocation);
      setMapZoom(14);
    }
  }, [userLocation]);

  /* --- Fetch popular places and recent submissions --- */
  useEffect(() => {
    getPopularPlaces()
      .then((res) => {
        const data = res.data;
        setPopularPlaces(Array.isArray(data) ? data.slice(0, 10) : (data.content || []).slice(0, 10));
      })
      .catch(() => setPopularPlaces([]));

    getSubmittedPlaces(0)
      .then((res) => {
        const data = res.data;
        setRecentSubmissions(Array.isArray(data) ? data.slice(0, 5) : (data.content || []).slice(0, 5));
      })
      .catch(() => setRecentSubmissions([]));
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                         */
  /* ---------------------------------------------------------------- */
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSelectedId(null);
  };

  const handleRegionChange = (code) => {
    setAreacode(code);
    setSelectedId(null);
    if (code && regionCenters[code]) {
      const rc = regionCenters[code];
      setMapCenter({ lat: rc.lat, lng: rc.lng });
      setMapZoom(rc.zoom);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setSelectedId(null);
  };

  const handleMarkerClick = useCallback((id) => {
    setSelectedId(id);
    setSheetState('half');
  }, []);

  const handlePlaceClick = (id) => {
    setSelectedId(id);
    setSheetState('half');
  };

  const handleCloseDetail = () => {
    setSelectedId(null);
    detail.handleCloseDetail();
  };

  const handleRefreshNearbyList = () => {
    const map = mapInstanceRef.current;
    if (!map || !window.naver || places.length === 0) return;
    const c = map.getCenter();
    refreshByCenter(c.lat(), c.lng());
  };

  const handleMapReady = useCallback((map) => {
    mapInstanceRef.current = map;
  }, []);

  const handleGpsClick = async () => {
    const loc = await requestLocation();
    if (loc) {
      setMapCenter(loc);
      setMapZoom(14);
    }
  };

  const handleSubmitSuccess = () => {
    getSubmittedPlaces(0)
      .then((res) => {
        const data = res.data;
        setRecentSubmissions(Array.isArray(data) ? data.slice(0, 5) : (data.content || []).slice(0, 5));
      })
      .catch(() => {});
  };

  /* --- Mobile sheet touch handling --- */
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 50) {
      setSheetState((prev) => (prev === 'peek' ? 'half' : 'full'));
    } else if (diff < -50) {
      setSheetState((prev) => (prev === 'full' ? 'half' : 'peek'));
    }
  };

  const handleDragHandleClick = () => {
    setSheetState((prev) => {
      if (prev === 'peek') return 'half';
      if (prev === 'half') return 'full';
      return 'peek';
    });
  };

  /* ---------------------------------------------------------------- */
  /*  Derived data                                                     */
  /* ---------------------------------------------------------------- */
  const filteredMapPlaces = category
    ? places.filter((p) => p.category === category)
    : places;

  const sheetHeight =
    sheetState === 'peek' ? `${SHEET_PEEK}px` :
    sheetState === 'half' ? `${SHEET_HALF}vh` :
    `${SHEET_FULL}vh`;

  /* ---------------------------------------------------------------- */
  /*  Sub-renders                                                      */
  /* ---------------------------------------------------------------- */

  const renderSearchForm = () => (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg px-4 py-2.5"
    >
      <svg className="w-5 h-5 text-pet-brown/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="장소명 또는 주소로 검색..."
        className="flex-1 bg-transparent text-sm text-pet-dark-brown placeholder:text-pet-brown/40 focus:outline-none"
      />
      <button
        type="submit"
        className="px-3 py-1.5 bg-pet-orange text-white text-xs font-bold rounded-xl hover:bg-pet-orange/90 transition-colors"
      >
        검색
      </button>
    </form>
  );

  const renderCategoryPills = () => (
    <div className="flex gap-1.5 items-center overflow-x-auto scrollbar-hide pb-1">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => handleCategoryChange(cat.key)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shadow-sm ${
            category === cat.key
              ? 'bg-pet-orange text-white shadow-pet-orange/30'
              : 'bg-white/90 backdrop-blur-lg text-pet-brown hover:bg-white'
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );

  const renderPlaceCard = (place) => {
    const thumbnailSrc = place.firstimage2 || place.imageUrls?.[0] || null;
    return (
      <div
        key={place.id}
        onClick={() => handlePlaceClick(place.id)}
        className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
          selectedId === place.id
            ? 'bg-pet-orange/8 border-l-[3px] border-pet-orange'
            : 'hover:bg-pet-cream/80 border-l-[3px] border-transparent'
        }`}
      >
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={place.title}
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling && (e.target.nextElementSibling.style.display = 'flex');
            }}
          />
        ) : null}
        <div
          className={`w-14 h-14 rounded-lg bg-gradient-to-br from-pet-peach to-pet-cream flex items-center justify-center flex-shrink-0 ${
            thumbnailSrc ? 'hidden' : ''
          }`}
        >
          <span className="text-lg">🐾</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm text-pet-dark-brown truncate">{place.title}</h3>
          <p className="text-xs text-pet-brown truncate mt-0.5">{place.addr1}</p>
          <div className="flex items-center gap-2 mt-1">
            {place.category && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${categoryColors[place.category] || categoryColors.OTHER}`}>
                {categoryLabels[place.category] || place.category}
              </span>
            )}
            {place.avgRating > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-pet-brown/50">
                <span className="text-pet-yellow">★</span>
                {place.avgRating.toFixed(1)}
                <span>({place.reviewCount})</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyList = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">🔍</div>
      <p className="text-sm text-pet-brown/50">검색 결과가 없습니다</p>
      <p className="text-xs text-pet-brown/30 mt-1">다른 키워드로 검색해보세요</p>
    </div>
  );

  const renderRefreshButton = () => (
    <button
      onClick={handleRefreshNearbyList}
      className="w-full mb-2 py-2 px-3 bg-pet-cream hover:bg-pet-peach rounded-xl text-xs font-semibold text-pet-orange transition-colors flex items-center justify-center gap-1.5"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      현재 위치 장소 보기
    </button>
  );

  /** Shared detail panel props */
  const detailProps = {
    placeDetail: detail.placeDetail,
    detailLoading: detail.detailLoading,
    selectedId,
    currentImg: detail.currentImg,
    setCurrentImg: detail.setCurrentImg,
    favorited: detail.favorited,
    onFavorite: detail.handleFavorite,
    voteData: detail.voteData,
    voteLoading: detail.voteLoading,
    onVote: detail.handleVote,
    reviews: detail.reviews,
    reviewPage: detail.reviewPage,
    setReviewPage: detail.setReviewPage,
    reviewTotalPages: detail.reviewTotalPages,
    onReviewSubmit: detail.handleReviewSubmit,
    onReviewDelete: (id) => detail.handleReviewDelete(id),
    newReview: detail.newReview,
    setNewReview: detail.setNewReview,
    newRating: detail.newRating,
    setNewRating: detail.setNewRating,
    guestName: detail.guestName,
    setGuestName: detail.setGuestName,
    isAuthenticated,
    userEmail: user?.email,
    onClose: handleCloseDetail,
  };

  /* ---------------------------------------------------------------- */
  /*  Main render                                                      */
  /* ---------------------------------------------------------------- */
  return (
    <div className="h-full flex relative overflow-hidden">
      <SEOHead
        title="반려동물 동반 장소 지도"
        description="내 주변 반려동물 동반 가능한 카페, 식당, 공원, 숙소를 지도에서 쉽게 찾아보세요. 위드펫에서 펫프렌들리 장소를 검색하세요."
        path="/map"
      />

      {/* ============================================================ */}
      {/* DESKTOP SIDEBAR (left) - place list                          */}
      {/* ============================================================ */}
      <div className="hidden md:flex flex-col w-[340px] flex-shrink-0 bg-white border-r border-pet-gray/60 z-20">
        {/* Sidebar header */}
        <div className="p-4 pb-2 border-b border-pet-gray/40">
          <Link to="/" className="flex items-center gap-1.5 mb-3">
            <span className="text-xl">🐾</span>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-pet-orange to-pet-pink bg-clip-text text-transparent">
              WithPet
            </span>
          </Link>
          <nav className="flex mb-3 bg-pet-gray rounded-xl p-1">
            <button className="flex-1 py-2 text-xs font-bold rounded-lg bg-white text-pet-orange shadow-sm transition-all">
              지도
            </button>
            <Link to="/feeds" className="flex-1 py-2 text-xs font-bold rounded-lg text-pet-brown/60 hover:text-pet-orange text-center transition-all">
              피드
            </Link>
            <Link to="/mypage" className="flex-1 py-2 text-xs font-bold rounded-lg text-pet-brown/60 hover:text-pet-orange text-center transition-all">
              마이
            </Link>
          </nav>
          <div className="mb-3">{renderSearchForm()}</div>
          <div className="mb-3">{renderCategoryPills()}</div>
          <h2 className="text-sm font-bold text-pet-dark-brown flex items-center gap-1.5">
            <svg className="w-4 h-4 text-pet-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            반려동물 동반 장소
            {listPlaces.length > 0 && (
              <span className="text-xs font-normal text-pet-brown/40 ml-1">({listPlaces.length})</span>
            )}
          </h2>
          <RegionSelector areacode={areacode} onChange={handleRegionChange} variant="buttons" />
        </div>

        {/* Popular ranking + Recent submissions */}
        <PopularRanking places={popularPlaces} selectedId={selectedId} onPlaceClick={handlePlaceClick} />
        <RecentSubmissions submissions={recentSubmissions} />

        {/* Place list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {renderRefreshButton()}
          {listPlaces.length === 0 ? renderEmptyList() : listPlaces.map(renderPlaceCard)}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAP AREA                                                     */}
      {/* ============================================================ */}
      <div className="flex-1 relative">
        {/* Mobile search overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2 md:hidden">
          {renderSearchForm()}
          <div className="flex gap-1.5 items-center overflow-x-auto scrollbar-hide pb-1">
            <RegionSelector areacode={areacode} onChange={handleRegionChange} variant="dropdown" />
            <div className="w-px h-5 bg-pet-brown/15 flex-shrink-0 mx-0.5" />
            {renderCategoryPills()}
          </div>
        </div>

        {/* Desktop auth overlay */}
        <div className="hidden md:flex absolute top-4 right-5 z-10 items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/mypage"
                className="flex items-center gap-2 bg-white/90 backdrop-blur-lg rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-pet-orange to-pet-pink flex items-center justify-center text-white text-[10px] font-bold">
                  {(user?.name || '?')[0]}
                </span>
                <span className="text-xs font-semibold text-pet-brown">{user?.name || '마이'}</span>
              </Link>
              <button
                onClick={logout}
                className="bg-white/90 backdrop-blur-lg rounded-full px-3 py-1.5 text-xs font-medium text-pet-brown/60 hover:text-pet-orange shadow-sm transition-all"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white/90 backdrop-blur-lg rounded-full px-4 py-1.5 text-xs font-bold text-pet-orange shadow-sm hover:shadow-md transition-all"
            >
              로그인
            </Link>
          )}
        </div>

        {/* GPS button */}
        <button
          onClick={handleGpsClick}
          disabled={gpsLoading}
          className="absolute bottom-44 md:bottom-6 right-4 z-10 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-pet-gray/60 disabled:opacity-60 disabled:cursor-not-allowed group"
          aria-label="내 위치로 이동"
          title="내 위치"
        >
          {gpsLoading ? (
            <svg className="w-5 h-5 text-pet-orange animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg
              className={`w-5 h-5 transition-colors duration-200 ${
                userLocation ? 'text-[#4285F4]' : 'text-pet-brown/70 group-hover:text-pet-orange'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
              <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
            </svg>
          )}
        </button>

        {/* Submit place floating button */}
        <button
          onClick={() => setSubmitModalOpen(true)}
          className="absolute bottom-24 md:bottom-6 left-4 z-10 flex items-center gap-1.5 px-4 py-2.5 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-pet-gray/60 text-sm font-bold text-pet-orange"
          aria-label="장소 제보"
          title="새 장소 제보하기"
        >
          <span className="text-base">➕</span>
          <span className="hidden sm:inline">장소 제보</span>
        </button>

        {/* Map */}
        {(loading || !gpsReady) ? (
          <div className="absolute inset-0 flex items-center justify-center bg-pet-cream">
            <div className="flex flex-col items-center gap-3">
              <div className="text-4xl animate-bounce">🐾</div>
              <p className="text-pet-brown text-sm font-medium">지도를 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <NaverMap
            places={filteredMapPlaces}
            selectedId={selectedId}
            onMarkerClick={handleMarkerClick}
            userLocation={userLocation}
            center={mapCenter}
            zoom={mapZoom}
            onMapReady={handleMapReady}
          />
        )}
      </div>

      {/* ============================================================ */}
      {/* DESKTOP DETAIL PANEL (right)                                 */}
      {/* ============================================================ */}
      <div
        className={`hidden md:block flex-shrink-0 bg-white border-l border-pet-gray/60 overflow-y-auto transition-all duration-300 ease-in-out ${
          detail.detailOpen ? 'w-[420px]' : 'w-0'
        }`}
      >
        <div className="w-[420px]">
          <PlaceDetail {...detailProps} />
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE BOTTOM SHEET                                          */}
      {/* ============================================================ */}
      <div
        ref={sheetRef}
        className="md:hidden fixed inset-x-0 bottom-16 z-30 bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out overflow-hidden"
        style={{ height: sheetHeight }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <button
          onClick={handleDragHandleClick}
          className="w-full flex flex-col items-center pt-2.5 pb-1.5 cursor-grab active:cursor-grabbing"
          aria-label="시트 높이 조절"
        >
          <div className="w-10 h-1 bg-pet-brown/20 rounded-full" />
        </button>

        {/* Sheet content */}
        <div className="overflow-y-auto h-[calc(100%-28px)] px-3">
          {detail.detailOpen && selectedId ? (
            <div>
              <button
                onClick={handleCloseDetail}
                className="flex items-center gap-1 text-xs text-pet-orange font-semibold mb-2 py-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                목록으로
              </button>
              <PlaceDetail {...detailProps} />
            </div>
          ) : (
            <div className="space-y-0.5 pb-4">
              {renderRefreshButton()}
              <h3 className="text-xs font-bold text-pet-dark-brown mb-2 px-1">
                주변 장소
                {listPlaces.length > 0 && (
                  <span className="font-normal text-pet-brown/40 ml-1">({listPlaces.length})</span>
                )}
              </h3>
              {listPlaces.length === 0
                ? renderEmptyList()
                : listPlaces.slice(0, 30).map(renderPlaceCard)}
            </div>
          )}
        </div>
      </div>

      {/* Submit place modal */}
      <SubmitPlaceModal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        mapInstanceRef={mapInstanceRef}
        mapCenter={mapCenter}
        onSubmitSuccess={handleSubmitSuccess}
      />

      {/* Review Delete Confirmation */}
      <ConfirmModal
        open={!!detail.reviewDeleteTarget}
        title="리뷰 삭제"
        message="리뷰를 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={() => detail.handleReviewDelete(detail.reviewDeleteTarget)}
        onCancel={() => detail.setReviewDeleteTarget(null)}
      />
    </div>
  );
}
