import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getMapPlaces, getPlaces, getPlace } from '../api/places';
import { getPlaceReviews, createPlaceReview } from '../api/reviews';
import { toggleFavorite } from '../api/favorites';
import NaverMap from '../components/map/NaverMap';
import StarRating from '../components/common/StarRating';
import SEOHead from '../components/common/SEOHead';
import useAuthStore from '../store/authStore';

/* ------------------------------------------------------------------ */
/*  Category data                                                      */
/* ------------------------------------------------------------------ */
const categories = [
  { key: '', label: '전체', icon: '📍' },
  { key: 'RESTAURANT', label: '식당', icon: '🍽️' },
  { key: 'CAFE', label: '카페', icon: '☕' },
  { key: 'ACCOMMODATION', label: '숙소', icon: '🏨' },
  { key: 'TOURIST', label: '관광', icon: '🏖️' },
  { key: 'LEISURE', label: '레저', icon: '🎯' },
  { key: 'SHOPPING', label: '쇼핑', icon: '🛍️' },
];

/* ------------------------------------------------------------------ */
/*  Region / area data                                                 */
/* ------------------------------------------------------------------ */
const regions = [
  { code: '', label: '전체' },
  { code: '1', label: '서울' },
  { code: '2', label: '인천' },
  { code: '3', label: '대전' },
  { code: '4', label: '대구' },
  { code: '5', label: '광주' },
  { code: '6', label: '부산' },
  { code: '7', label: '울산' },
  { code: '8', label: '세종' },
  { code: '31', label: '경기' },
  { code: '32', label: '강원' },
  { code: '33', label: '충북' },
  { code: '34', label: '충남' },
  { code: '35', label: '경북' },
  { code: '36', label: '경남' },
  { code: '37', label: '전북' },
  { code: '38', label: '전남' },
  { code: '39', label: '제주' },
];

const regionCenters = {
  '1':  { lat: 37.5665, lng: 126.978,  zoom: 11 },
  '2':  { lat: 37.4563, lng: 126.7052, zoom: 11 },
  '3':  { lat: 36.3504, lng: 127.3845, zoom: 12 },
  '4':  { lat: 35.8714, lng: 128.6014, zoom: 12 },
  '5':  { lat: 35.1595, lng: 126.8526, zoom: 12 },
  '6':  { lat: 35.1796, lng: 129.0756, zoom: 11 },
  '7':  { lat: 35.5384, lng: 129.3114, zoom: 12 },
  '8':  { lat: 36.4800, lng: 127.2890, zoom: 12 },
  '31': { lat: 37.4138, lng: 127.5183, zoom: 9 },
  '32': { lat: 37.8228, lng: 128.1555, zoom: 9 },
  '33': { lat: 36.6357, lng: 127.4917, zoom: 9 },
  '34': { lat: 36.5184, lng: 126.8000, zoom: 9 },
  '35': { lat: 36.4919, lng: 128.8889, zoom: 9 },
  '36': { lat: 35.4606, lng: 128.2132, zoom: 9 },
  '37': { lat: 35.7175, lng: 127.1530, zoom: 9 },
  '38': { lat: 34.8679, lng: 126.9910, zoom: 9 },
  '39': { lat: 33.4890, lng: 126.4983, zoom: 10 },
};

/* ------------------------------------------------------------------ */
/*  Bottom sheet states (mobile)                                       */
/* ------------------------------------------------------------------ */
const SHEET_PEEK = 80;      // px - just drag handle + preview
const SHEET_HALF = 50;      // vh
const SHEET_FULL = 90;      // vh

/* ------------------------------------------------------------------ */
/*  MapPage - main landing page                                        */
/* ------------------------------------------------------------------ */
export default function MapPage() {
  /* --- Data state --- */
  const [places, setPlaces] = useState([]);
  const [listPlaces, setListPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  /* --- Region filter state --- */
  const [areacode, setAreacode] = useState('');
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  /* --- GPS / user location state --- */
  const [userLocation, setUserLocation] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  /* --- Map control state --- */
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(null);
  const mapInstanceRef = useRef(null);

  /* --- Detail state --- */
  const [placeDetail, setPlaceDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  /* --- Review form state --- */
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  /* --- UI state --- */
  const [sheetState, setSheetState] = useState('half'); // 'peek' | 'half' | 'full'
  const [detailOpen, setDetailOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();
  const sheetRef = useRef(null);
  const touchStartY = useRef(0);
  const regionDropdownRef = useRef(null);

  /* ---------------------------------------------------------------- */
  /*  Close region dropdown on outside click                           */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(e.target)) {
        setRegionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Data fetching                                                    */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    getMapPlaces()
      .then((res) => setPlaces(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
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

  /* Fetch detail when a place is selected */
  useEffect(() => {
    if (!selectedId) {
      setPlaceDetail(null);
      setDetailOpen(false);
      setReviews([]);
      setReviewPage(0);
      return;
    }
    setDetailLoading(true);
    setDetailOpen(true);
    setCurrentImg(0);
    getPlace(selectedId)
      .then((res) => {
        setPlaceDetail(res.data);
        setFavorited(res.data.favorited || false);
      })
      .catch(() => setPlaceDetail(null))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  /* Fetch reviews for selected place */
  useEffect(() => {
    if (!selectedId) return;
    getPlaceReviews(selectedId, reviewPage)
      .then((res) => {
        setReviews(res.data.content || []);
        setReviewTotalPages(res.data.totalPages || 0);
      })
      .catch(() => { setReviews([]); setReviewTotalPages(0); });
  }, [selectedId, reviewPage]);

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                         */
  /* ---------------------------------------------------------------- */
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSelectedId(null);
  };

  const handleRegionChange = (code) => {
    setAreacode(code);
    setRegionDropdownOpen(false);
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
    setDetailOpen(false);
    setPlaceDetail(null);
  };

  const handleFavorite = async () => {
    if (!selectedId) return;
    try {
      const res = await toggleFavorite(selectedId);
      setFavorited(res.data.favorited);
    } catch {}
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim() || !selectedId) return;
    try {
      await createPlaceReview(selectedId, { content: newReview, rating: newRating });
      setNewReview('');
      setNewRating(5);
      const res = await getPlaceReviews(selectedId, 0);
      setReviews(res.data.content || []);
      setReviewTotalPages(res.data.totalPages || 0);
      setReviewPage(0);
      // Refresh place detail for updated rating
      const placeRes = await getPlace(selectedId);
      setPlaceDetail(placeRes.data);
    } catch {
      alert('리뷰 작성에 실패했습니다.');
    }
  };

  const handleMapReady = useCallback((map) => {
    mapInstanceRef.current = map;
  }, []);

  /* --- GPS location handler --- */
  const handleGpsClick = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저에서는 위치 서비스를 지원하지 않습니다.');
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        setMapCenter(loc);
        setMapZoom(14);
        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('위치 접근 권한이 거부되었습니다.\n브라우저 설정에서 위치 권한을 허용해주세요.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('위치 정보를 사용할 수 없습니다.');
            break;
          case error.TIMEOUT:
            alert('위치 요청 시간이 초과되었습니다.');
            break;
          default:
            alert('알 수 없는 오류가 발생했습니다.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  /* --- Mobile sheet touch handling --- */
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 50) {
      // Swipe up
      setSheetState((prev) => (prev === 'peek' ? 'half' : 'full'));
    } else if (diff < -50) {
      // Swipe down
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

  const selectedRegionLabel = regions.find((r) => r.code === areacode)?.label || '지역';

  /* ---------------------------------------------------------------- */
  /*  Sub-renders                                                      */
  /* ---------------------------------------------------------------- */

  /** Region dropdown selector */
  const renderRegionSelector = () => (
    <div ref={regionDropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setRegionDropdownOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shadow-sm border ${
          areacode
            ? 'bg-pet-orange text-white border-pet-orange shadow-pet-orange/30'
            : 'bg-white/90 backdrop-blur-lg text-pet-brown border-transparent hover:bg-white'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{selectedRegionLabel}</span>
        <svg className={`w-3 h-3 transition-transform duration-200 ${regionDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {regionDropdownOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-pet-gray/60 py-1.5 z-50 max-h-64 overflow-y-auto">
          {regions.map((region) => (
            <button
              key={region.code}
              onClick={() => handleRegionChange(region.code)}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                areacode === region.code
                  ? 'bg-pet-orange/10 text-pet-orange font-bold'
                  : 'text-pet-brown hover:bg-pet-cream/80'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  /** Search bar overlay (positioned on top of the map) */
  const renderSearchOverlay = () => (
    <div className="absolute top-4 left-4 right-4 md:left-[356px] md:right-5 z-10 flex flex-col gap-2">
      {/* Search bar */}
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

      {/* Category pills + region selector row */}
      <div className="flex gap-1.5 items-center overflow-x-auto scrollbar-hide pb-1">
        {/* Region selector */}
        {renderRegionSelector()}

        {/* Divider */}
        <div className="w-px h-5 bg-pet-brown/15 flex-shrink-0 mx-0.5" />

        {/* Category pills */}
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
    </div>
  );

  /** Desktop auth overlay (top-right on map page) */
  const renderDesktopAuthOverlay = () => (
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
  );

  /** GPS "내 위치" button */
  const renderGpsButton = () => (
    <button
      onClick={handleGpsClick}
      disabled={gpsLoading}
      className="absolute bottom-24 md:bottom-6 right-4 z-10 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-pet-gray/60 disabled:opacity-60 disabled:cursor-not-allowed group"
      aria-label="내 위치로 이동"
      title="내 위치"
    >
      {gpsLoading ? (
        /* Loading spinner */
        <svg className="w-5 h-5 text-pet-orange animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        /* Crosshair / target icon */
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
  );

  /** Place list card (used in sidebar and bottom sheet) */
  const renderPlaceCard = (place) => {
    /* Determine the thumbnail: prefer firstimage2 (thumbnail), then imageUrls, then fallback */
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
          <p className="text-xs text-pet-brown/60 truncate mt-0.5">{place.addr1}</p>
          <div className="flex items-center gap-2 mt-1">
            {place.category && (
              <span className="px-1.5 py-0.5 bg-pet-mint/60 text-pet-dark-brown rounded text-[10px] font-medium">
                {place.category}
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

  /** Empty list state */
  const renderEmptyList = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">🔍</div>
      <p className="text-sm text-pet-brown/50">검색 결과가 없습니다</p>
      <p className="text-xs text-pet-brown/30 mt-1">다른 키워드로 검색해보세요</p>
    </div>
  );

  /** Detail panel content (shared between desktop panel and mobile sheet) */
  const renderDetailContent = () => {
    if (detailLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl animate-bounce">🐾</div>
            <p className="text-pet-brown text-sm font-medium">로딩 중...</p>
          </div>
        </div>
      );
    }

    if (!placeDetail) return null;

    /* Build the image list: firstimage first, then imageUrls (deduplicated) */
    const allImages = [];
    if (placeDetail.firstimage) {
      allImages.push(placeDetail.firstimage);
    }
    if (placeDetail.imageUrls?.length > 0) {
      placeDetail.imageUrls.forEach((url) => {
        if (!allImages.includes(url)) {
          allImages.push(url);
        }
      });
    }

    return (
      <div>
        {/* Image carousel */}
        {allImages.length > 0 ? (
          <div className="relative">
            <img
              src={allImages[currentImg] || allImages[0]}
              alt={placeDetail.title}
              className="w-full h-52 object-cover"
              onError={(e) => {
                e.target.src = '';
                e.target.classList.add('hidden');
              }}
            />
            {allImages.length > 1 && (
              <>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentImg ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                      aria-label={`이미지 ${i + 1}`}
                    />
                  ))}
                </div>
                {currentImg > 0 && (
                  <button
                    onClick={() => setCurrentImg((p) => p - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
                    aria-label="이전 이미지"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {currentImg < allImages.length - 1 && (
                  <button
                    onClick={() => setCurrentImg((p) => p + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
                    aria-label="다음 이미지"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-36 bg-gradient-to-br from-pet-peach to-pet-cream flex items-center justify-center">
            <span className="text-5xl">🐾</span>
          </div>
        )}

        {/* Place info */}
        <div className="p-4">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-pet-dark-brown leading-snug">{placeDetail.title}</h2>
              <p className="text-xs text-pet-brown/60 mt-1">📍 {placeDetail.addr1}</p>
              {placeDetail.tel && (
                <p className="text-xs text-pet-brown/60">📞 {placeDetail.tel}</p>
              )}
            </div>
            {/* Close button - desktop only, mobile uses sheet drag */}
            <button
              onClick={handleCloseDetail}
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-full hover:bg-pet-gray transition-colors flex-shrink-0"
              aria-label="닫기"
            >
              <svg className="w-5 h-5 text-pet-brown/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Rating & category */}
          <div className="flex items-center gap-3 mb-4">
            {placeDetail.category && (
              <span className="px-2 py-0.5 bg-pet-mint text-pet-dark-brown rounded-full text-xs font-medium">
                {placeDetail.category}
              </span>
            )}
            {placeDetail.avgRating > 0 && (
              <div className="flex items-center gap-1">
                <StarRating rating={Math.round(placeDetail.avgRating)} readOnly size="text-sm" />
                <span className="text-xs text-pet-brown font-semibold">{placeDetail.avgRating.toFixed(1)}</span>
                <span className="text-xs text-pet-brown/40">({placeDetail.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mb-6">
            {isAuthenticated && (
              <button
                onClick={handleFavorite}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  favorited
                    ? 'bg-pet-pink/15 text-pet-pink border border-pet-pink/30'
                    : 'bg-pet-gray text-pet-brown hover:bg-pet-peach/50 border border-transparent'
                }`}
              >
                <span>{favorited ? '❤️' : '🤍'}</span>
                찜하기
              </button>
            )}
            {placeDetail.tel && (
              <a
                href={`tel:${placeDetail.tel}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-pet-gray text-pet-brown hover:bg-pet-peach/50 transition-colors"
              >
                📞 전화
              </a>
            )}
            <Link
              to={`/places/${selectedId}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-pet-gray text-pet-brown hover:bg-pet-peach/50 transition-colors"
            >
              📋 상세
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-pet-gray mb-4" />

          {/* Reviews section */}
          <div>
            <h3 className="text-sm font-bold text-pet-dark-brown mb-3">
              리뷰 {placeDetail.reviewCount > 0 && `(${placeDetail.reviewCount})`}
            </h3>

            {/* Write review form */}
            {isAuthenticated && (
              <form onSubmit={handleReviewSubmit} className="mb-4 p-3 bg-pet-cream/80 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-pet-brown font-medium">별점</span>
                  <StarRating rating={newRating} onChange={setNewRating} size="text-base" />
                </div>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="방문 후기를 남겨주세요..."
                  className="w-full p-2.5 rounded-lg border border-pet-gray/80 bg-white text-xs resize-none h-16 focus:outline-none focus:border-pet-orange transition-colors"
                />
                <button
                  type="submit"
                  className="mt-2 px-3 py-1.5 bg-pet-orange text-white rounded-lg text-xs font-semibold hover:bg-pet-orange/90 transition-colors"
                >
                  리뷰 작성
                </button>
              </form>
            )}

            {/* Review list */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-xs text-pet-brown/40 text-center py-4">아직 리뷰가 없습니다</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="p-3 border border-pet-gray/80 rounded-xl">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-xs text-pet-brown">{review.writerName}</span>
                      <StarRating rating={review.rating} readOnly size="text-xs" />
                      <span className="text-[10px] text-pet-brown/40 ml-auto">
                        {new Date(review.regDate).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-xs text-pet-brown/80 leading-relaxed">{review.content}</p>
                    {review.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {review.tags.map((tag, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-pet-mint/60 text-pet-dark-brown rounded text-[10px] font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Review pagination (simple prev/next) */}
            {reviewTotalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => setReviewPage((p) => Math.max(0, p - 1))}
                  disabled={reviewPage === 0}
                  className="px-3 py-1 rounded-lg text-xs bg-white text-pet-brown border border-pet-gray hover:bg-pet-peach disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  이전
                </button>
                <span className="text-xs text-pet-brown/60">{reviewPage + 1} / {reviewTotalPages}</span>
                <button
                  onClick={() => setReviewPage((p) => Math.min(reviewTotalPages - 1, p + 1))}
                  disabled={reviewPage >= reviewTotalPages - 1}
                  className="px-3 py-1 rounded-lg text-xs bg-white text-pet-brown border border-pet-gray hover:bg-pet-peach disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
      {/* ================================================================ */}
      {/* DESKTOP SIDEBAR (left) - place list                              */}
      {/* ================================================================ */}
      <div className="hidden md:flex flex-col w-[340px] flex-shrink-0 bg-white border-r border-pet-gray/60 z-20">
        {/* Sidebar header with logo */}
        <div className="p-4 pb-2 border-b border-pet-gray/40">
          <Link to="/" className="flex items-center gap-1.5 mb-3">
            <span className="text-xl">🐾</span>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-pet-orange to-pet-pink bg-clip-text text-transparent">
              WithPet
            </span>
          </Link>
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

          {/* Sidebar region filter (desktop) */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {regions.slice(0, 9).map((region) => (
              <button
                key={region.code}
                onClick={() => handleRegionChange(region.code)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
                  areacode === region.code
                    ? 'bg-pet-orange text-white'
                    : 'bg-pet-gray text-pet-brown/70 hover:bg-pet-peach/50'
                }`}
              >
                {region.label}
              </button>
            ))}
          </div>
          <div className="mt-1 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {regions.slice(9).map((region) => (
              <button
                key={region.code}
                onClick={() => handleRegionChange(region.code)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
                  areacode === region.code
                    ? 'bg-pet-orange text-white'
                    : 'bg-pet-gray text-pet-brown/70 hover:bg-pet-peach/50'
                }`}
              >
                {region.label}
              </button>
            ))}
          </div>
        </div>

        {/* Place list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {listPlaces.length === 0 ? renderEmptyList() : listPlaces.map(renderPlaceCard)}
        </div>
      </div>

      {/* ================================================================ */}
      {/* MAP AREA                                                         */}
      {/* ================================================================ */}
      <div className="flex-1 relative">
        {/* Search + category overlay */}
        {renderSearchOverlay()}

        {/* Desktop auth overlay */}
        {renderDesktopAuthOverlay()}

        {/* GPS button */}
        {renderGpsButton()}

        {/* Map itself */}
        {loading ? (
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

      {/* ================================================================ */}
      {/* DESKTOP DETAIL PANEL (right)                                     */}
      {/* ================================================================ */}
      <div
        className={`hidden md:block flex-shrink-0 bg-white border-l border-pet-gray/60 overflow-y-auto transition-all duration-300 ease-in-out ${
          detailOpen ? 'w-[420px]' : 'w-0'
        }`}
      >
        <div className="w-[420px]">
          {renderDetailContent()}
        </div>
      </div>

      {/* ================================================================ */}
      {/* MOBILE BOTTOM SHEET                                              */}
      {/* ================================================================ */}
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
          {detailOpen && selectedId ? (
            /* Detail view */
            <div>
              {/* Back button */}
              <button
                onClick={handleCloseDetail}
                className="flex items-center gap-1 text-xs text-pet-orange font-semibold mb-2 py-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                목록으로
              </button>
              {renderDetailContent()}
            </div>
          ) : (
            /* Place list */
            <div className="space-y-0.5 pb-4">
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
    </div>
  );
}
