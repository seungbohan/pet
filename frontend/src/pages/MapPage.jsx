import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getMapPlaces, getPlaces, getPlace, votePlace, submitPlace, getPopularPlaces, getSubmittedPlaces } from '../api/places';
import { getPlaceReviews, createPlaceReview, deleteReview } from '../api/reviews';
import { toggleFavorite } from '../api/favorites';
import NaverMap from '../components/map/NaverMap';
import StarRating from '../components/common/StarRating';
import SEOHead from '../components/common/SEOHead';
import useAuthStore from '../store/authStore';
import { uploadImages, getImageUrl } from '../api/upload';

/* ------------------------------------------------------------------ */
/*  Category data                                                      */
/* ------------------------------------------------------------------ */
const categories = [
  { key: '', label: '전체', icon: '📍' },
  { key: 'CAFE', label: '카페', icon: '☕' },
  { key: 'RESTAURANT', label: '식당', icon: '🍽️' },
  { key: 'ACCOMMODATION', label: '숙소', icon: '🏨' },
  { key: 'PARK', label: '공원', icon: '🌿' },
  { key: 'HOSPITAL', label: '동물병원', icon: '🏥' },
  { key: 'TOURIST', label: '관광', icon: '🏖️' },
  { key: 'LEISURE', label: '레저', icon: '🎯' },
  { key: 'CULTURE', label: '문화', icon: '🎭' },
  { key: 'SHOPPING', label: '쇼핑', icon: '🛍️' },
];

const categoryColors = {
  CAFE: 'bg-amber-100 text-amber-800',
  RESTAURANT: 'bg-red-100 text-red-800',
  ACCOMMODATION: 'bg-blue-100 text-blue-800',
  PARK: 'bg-green-100 text-green-800',
  HOSPITAL: 'bg-pink-100 text-pink-800',
  TOURIST: 'bg-cyan-100 text-cyan-800',
  LEISURE: 'bg-purple-100 text-purple-800',
  CULTURE: 'bg-indigo-100 text-indigo-800',
  SHOPPING: 'bg-orange-100 text-orange-800',
  OTHER: 'bg-gray-100 text-gray-800',
};

const categoryLabels = {
  CAFE: '☕ 카페',
  RESTAURANT: '🍽️ 식당',
  ACCOMMODATION: '🏨 숙소',
  PARK: '🌿 공원',
  HOSPITAL: '🏥 동물병원',
  TOURIST: '🏖️ 관광',
  LEISURE: '🎯 레저',
  CULTURE: '🎭 문화',
  SHOPPING: '🛍️ 쇼핑',
  OTHER: '📍 기타',
};

/** Category options for the submit form dropdown */
const submitCategories = [
  { key: 'CAFE', label: '카페' },
  { key: 'RESTAURANT', label: '식당' },
  { key: 'ACCOMMODATION', label: '숙소' },
  { key: 'PARK', label: '공원' },
  { key: 'HOSPITAL', label: '동물병원' },
  { key: 'TOURIST', label: '관광' },
  { key: 'LEISURE', label: '레저' },
  { key: 'CULTURE', label: '문화' },
  { key: 'SHOPPING', label: '쇼핑' },
  { key: 'OTHER', label: '기타' },
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
/*  Rank medal colors                                                  */
/* ------------------------------------------------------------------ */
const rankColors = {
  1: 'text-yellow-500',   // gold
  2: 'text-gray-400',     // silver
  3: 'text-amber-600',    // bronze
};

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
  const [guestName, setGuestName] = useState('');

  /* --- UI state --- */
  const [sheetState, setSheetState] = useState('half'); // 'peek' | 'half' | 'full'
  const [detailOpen, setDetailOpen] = useState(false);

  /* ================================================================ */
  /*  NEW: Vote state (Feature 1)                                      */
  /* ================================================================ */
  const [voteData, setVoteData] = useState({ upvotes: 0, downvotes: 0, userVote: null });
  const [voteLoading, setVoteLoading] = useState(false);

  /* ================================================================ */
  /*  NEW: Submit modal state (Feature 2)                              */
  /* ================================================================ */
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    title: '',
    addr1: '',
    tel: '',
    category: '',
    description: '',
    latitude: '',
    longitude: '',
    imageUrl: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitImgUploading, setSubmitImgUploading] = useState(false);

  /* ================================================================ */
  /*  NEW: Popular places ranking state (Feature 3)                    */
  /* ================================================================ */
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [rankingOpen, setRankingOpen] = useState(true);

  /* ================================================================ */
  /*  NEW: Recent submissions state (Feature 4)                        */
  /* ================================================================ */
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [submissionsOpen, setSubmissionsOpen] = useState(true);

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
  /*  Auto-detect user location on mount                               */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        setMapCenter(loc);
        setMapZoom(14);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );
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
      setVoteData({ upvotes: 0, downvotes: 0, userVote: null });
      return;
    }
    setDetailLoading(true);
    setDetailOpen(true);
    setCurrentImg(0);
    getPlace(selectedId)
      .then((res) => {
        setPlaceDetail(res.data);
        setFavorited(res.data.favorited || false);
        /* Extract vote data from the place detail response */
        setVoteData({
          upvotes: res.data.upvotes || 0,
          downvotes: res.data.downvotes || 0,
          userVote: res.data.userVote ?? null,  // 'up', 'down', or null
        });
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

  /* ================================================================ */
  /*  NEW: Fetch popular places and recent submissions (Features 3+4)  */
  /* ================================================================ */
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
      await createPlaceReview(selectedId, { content: newReview, rating: newRating, guestName: !isAuthenticated ? (guestName || '비회원') : undefined });
      setNewReview('');
      setNewRating(5);
      setGuestName('');
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

  const handleReviewDelete = async (reviewId) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;
    try {
      await deleteReview(reviewId);
      const res = await getPlaceReviews(selectedId, 0);
      setReviews(res.data.content || []);
      setReviewTotalPages(res.data.totalPages || 0);
      setReviewPage(0);
      const placeRes = await getPlace(selectedId);
      setPlaceDetail(placeRes.data);
    } catch {
      alert('삭제에 실패했습니다.');
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

  /* ================================================================ */
  /*  NEW: Vote handler (Feature 1)                                    */
  /* ================================================================ */
  const handleVote = async (isUpvote) => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다');
      return;
    }
    if (!selectedId || voteLoading) return;

    setVoteLoading(true);
    try {
      const res = await votePlace(selectedId, isUpvote);
      setVoteData({
        upvotes: res.data.upvotes ?? voteData.upvotes,
        downvotes: res.data.downvotes ?? voteData.downvotes,
        userVote: res.data.userVote ?? null,
      });
    } catch {
      /* Optimistic fallback: toggle locally */
      setVoteData((prev) => {
        const wasUp = prev.userVote === 'up';
        const wasDown = prev.userVote === 'down';

        if (isUpvote) {
          if (wasUp) {
            // Cancel upvote
            return { ...prev, upvotes: prev.upvotes - 1, userVote: null };
          }
          return {
            upvotes: prev.upvotes + 1,
            downvotes: wasDown ? prev.downvotes - 1 : prev.downvotes,
            userVote: 'up',
          };
        } else {
          if (wasDown) {
            // Cancel downvote
            return { ...prev, downvotes: prev.downvotes - 1, userVote: null };
          }
          return {
            upvotes: wasUp ? prev.upvotes - 1 : prev.upvotes,
            downvotes: prev.downvotes + 1,
            userVote: 'down',
          };
        }
      });
    } finally {
      setVoteLoading(false);
    }
  };

  /* ================================================================ */
  /*  NEW: Submit place handler (Feature 2)                            */
  /* ================================================================ */
  const handleSubmitPlace = async (e) => {
    e.preventDefault();
    if (!submitForm.title.trim() || !submitForm.addr1.trim()) {
      alert('장소명과 주소는 필수 입력입니다.');
      return;
    }
    setSubmitLoading(true);
    try {
      await submitPlace({
        title: submitForm.title,
        addr1: submitForm.addr1,
        tel: submitForm.tel || undefined,
        category: submitForm.category || undefined,
        description: submitForm.description || undefined,
        latitude: submitForm.latitude ? parseFloat(submitForm.latitude) : undefined,
        longitude: submitForm.longitude ? parseFloat(submitForm.longitude) : undefined,
        imageUrl: submitForm.imageUrl || undefined,
      });
      setSubmitSuccess(true);
      setSubmitForm({ title: '', addr1: '', tel: '', category: '', description: '', latitude: '', longitude: '', imageUrl: '' });
      // Refresh recent submissions
      getSubmittedPlaces(0)
        .then((res) => {
          const data = res.data;
          setRecentSubmissions(Array.isArray(data) ? data.slice(0, 5) : (data.content || []).slice(0, 5));
        })
        .catch(() => {});
    } catch {
      alert('장소 제보에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseSubmitModal = () => {
    setSubmitModalOpen(false);
    setSubmitSuccess(false);
    setSubmitForm({ title: '', addr1: '', tel: '', category: '', description: '', latitude: '', longitude: '', imageUrl: '' });
  };

  /** Use current map center as submit coordinates */
  const handleUseMapCenter = () => {
    const map = mapInstanceRef.current;
    if (map) {
      const center = map.getCenter();
      setSubmitForm((prev) => ({
        ...prev,
        latitude: center.lat().toFixed(6),
        longitude: center.lng().toFixed(6),
      }));
    } else if (mapCenter) {
      setSubmitForm((prev) => ({
        ...prev,
        latitude: mapCenter.lat.toFixed(6),
        longitude: mapCenter.lng.toFixed(6),
      }));
    }
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
  /*  Helper: time-ago string                                          */
  /* ---------------------------------------------------------------- */
  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const now = new Date();
    const then = new Date(dateStr);
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay}일 전`;
    return then.toLocaleDateString('ko-KR');
  };

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

  /** Search bar (used in sidebar on desktop, overlay on mobile) */
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
  );

  /** Mobile-only search overlay */
  const renderMobileSearchOverlay = () => (
    <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2 md:hidden">
      {renderSearchForm()}
      <div className="flex gap-1.5 items-center overflow-x-auto scrollbar-hide pb-1">
        {renderRegionSelector()}
        <div className="w-px h-5 bg-pet-brown/15 flex-shrink-0 mx-0.5" />
        {renderCategoryPills()}
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
      className="absolute bottom-44 md:bottom-6 right-4 z-10 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-pet-gray/60 disabled:opacity-60 disabled:cursor-not-allowed group"
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

  /** Empty list state */
  const renderEmptyList = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">🔍</div>
      <p className="text-sm text-pet-brown/50">검색 결과가 없습니다</p>
      <p className="text-xs text-pet-brown/30 mt-1">다른 키워드로 검색해보세요</p>
    </div>
  );

  /* ================================================================ */
  /*  NEW: Vote buttons render (Feature 1)                             */
  /* ================================================================ */
  const renderVoteButtons = () => (
    <div className="flex gap-2 mb-4">
      {/* Upvote button */}
      <button
        onClick={() => handleVote(true)}
        disabled={voteLoading}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-60 ${
          voteData.userVote === 'up'
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
            : 'bg-green-50 text-green-600 hover:bg-green-100'
        }`}
        aria-label="추천"
      >
        <span className="text-base">👍</span>
        <span>추천</span>
        <span className="font-bold">{voteData.upvotes}</span>
      </button>

      {/* Downvote button */}
      <button
        onClick={() => handleVote(false)}
        disabled={voteLoading}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-60 ${
          voteData.userVote === 'down'
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
            : 'bg-red-50 text-red-600 hover:bg-red-100'
        }`}
        aria-label="비추천"
      >
        <span className="text-base">👎</span>
        <span>비추천</span>
        <span className="font-bold">{voteData.downvotes}</span>
      </button>
    </div>
  );

  /* ================================================================ */
  /*  NEW: Popular places ranking render (Feature 3)                   */
  /* ================================================================ */
  const renderPopularRanking = () => {
    if (popularPlaces.length === 0) return null;

    return (
      <div className="border-b border-pet-gray/40">
        {/* Collapsible header */}
        <button
          onClick={() => setRankingOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-pet-cream/40 transition-colors"
        >
          <h3 className="text-sm font-bold text-pet-dark-brown flex items-center gap-1.5">
            <span>🏆</span> 인기 장소
          </h3>
          <svg
            className={`w-4 h-4 text-pet-brown/50 transition-transform duration-200 ${rankingOpen ? '' : '-rotate-90'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Ranking list */}
        {rankingOpen && (
          <div className="px-2 pb-2 space-y-0.5">
            {popularPlaces.map((place, index) => {
              const rank = index + 1;
              const medalColor = rankColors[rank] || 'text-pet-brown/50';

              return (
                <div
                  key={place.id}
                  onClick={() => handlePlaceClick(place.id)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                    selectedId === place.id
                      ? 'bg-pet-orange/10'
                      : 'hover:bg-pet-cream/80'
                  }`}
                >
                  {/* Rank number */}
                  <span className={`w-5 text-center font-extrabold text-sm ${medalColor}`}>
                    {rank}
                  </span>

                  {/* Place info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-pet-dark-brown truncate">{place.title}</h4>
                      <span className="flex items-center gap-0.5 text-[10px] text-green-600 font-semibold flex-shrink-0">
                        👍 {place.upvotes || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {place.category && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${categoryColors[place.category] || categoryColors.OTHER}`}>
                          {categoryLabels[place.category] || place.category}
                        </span>
                      )}
                      {place.addr1 && (
                        <span className="text-[10px] text-pet-brown/70 truncate">
                          {/* Show city name only */}
                          {place.addr1.split(' ').slice(0, 2).join(' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  /* ================================================================ */
  /*  NEW: Recent submissions render (Feature 4)                       */
  /* ================================================================ */
  const renderRecentSubmissions = () => {
    if (recentSubmissions.length === 0) return null;

    return (
      <div className="border-b border-pet-gray/40">
        {/* Collapsible header */}
        <button
          onClick={() => setSubmissionsOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-pet-cream/40 transition-colors"
        >
          <h3 className="text-sm font-bold text-pet-dark-brown flex items-center gap-1.5">
            <span>📌</span> 최근 제보
          </h3>
          <svg
            className={`w-4 h-4 text-pet-brown/50 transition-transform duration-200 ${submissionsOpen ? '' : '-rotate-90'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Submissions list */}
        {submissionsOpen && (
          <div className="px-2 pb-2 space-y-0.5">
            {recentSubmissions.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-pet-cream/80 transition-colors"
              >
                {/* Place info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-pet-dark-brown truncate">{item.title}</h4>
                    {/* Status badge */}
                    {item.status === 'APPROVED' ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-green-100 text-green-700 flex-shrink-0">
                        승인
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-yellow-100 text-yellow-700 flex-shrink-0">
                        대기중
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {item.submitterName && (
                      <span className="text-[10px] text-pet-brown/50">{item.submitterName}</span>
                    )}
                    {item.createdAt && (
                      <span className="text-[10px] text-pet-brown/30">{timeAgo(item.createdAt)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ================================================================ */
  /*  NEW: Submit place modal render (Feature 2)                       */
  /* ================================================================ */
  const renderSubmitModal = () => {
    if (!submitModalOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={handleCloseSubmitModal}
        />

        {/* Modal panel */}
        <div
          className={`
            fixed z-50 bg-white shadow-xl overflow-y-auto
            /* Mobile: slide up from bottom */
            inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl
            /* Desktop: slide in from right */
            md:inset-y-0 md:right-0 md:left-auto md:bottom-auto md:w-[420px] md:max-h-full md:rounded-t-none md:rounded-l-2xl
            animate-in
          `}
          style={{
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-pet-gray/40 px-5 py-4 flex items-center justify-between z-10">
            <h2 className="text-base font-bold text-pet-dark-brown flex items-center gap-2">
              <span className="text-lg">🐾</span> 장소 제보
            </h2>
            <button
              onClick={handleCloseSubmitModal}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-pet-gray transition-colors"
              aria-label="닫기"
            >
              <svg className="w-5 h-5 text-pet-brown/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            {submitSuccess ? (
              /* Success message */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-pet-dark-brown mb-2">제보 완료!</h3>
                <p className="text-sm text-pet-brown/60 leading-relaxed">
                  제보해주셔서 감사합니다!<br />
                  관리자 검토 후 등록됩니다.
                </p>
                <button
                  onClick={handleCloseSubmitModal}
                  className="mt-6 px-6 py-2.5 bg-pet-orange text-white rounded-xl text-sm font-bold hover:bg-pet-orange/90 transition-colors"
                >
                  확인
                </button>
              </div>
            ) : (
              /* Submit form */
              <form onSubmit={handleSubmitPlace} className="space-y-4">
                {/* 장소명 */}
                <div>
                  <label className="block text-xs font-semibold text-pet-brown mb-1.5">
                    장소명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={submitForm.title}
                    onChange={(e) => setSubmitForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="예: 멍멍카페 서울점"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pet-gray/80 bg-white text-sm text-pet-dark-brown placeholder:text-pet-brown/30 focus:outline-none focus:border-pet-orange focus:ring-1 focus:ring-pet-orange/30 transition-all"
                    required
                  />
                </div>

                {/* 주소 */}
                <div>
                  <label className="block text-xs font-semibold text-pet-brown mb-1.5">
                    주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={submitForm.addr1}
                    onChange={(e) => setSubmitForm((f) => ({ ...f, addr1: e.target.value }))}
                    placeholder="예: 서울특별시 강남구 역삼동 123-45"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pet-gray/80 bg-white text-sm text-pet-dark-brown placeholder:text-pet-brown/30 focus:outline-none focus:border-pet-orange focus:ring-1 focus:ring-pet-orange/30 transition-all"
                    required
                  />
                </div>

                {/* 전화번호 */}
                <div>
                  <label className="block text-xs font-semibold text-pet-brown mb-1.5">전화번호</label>
                  <input
                    type="tel"
                    value={submitForm.tel}
                    onChange={(e) => setSubmitForm((f) => ({ ...f, tel: e.target.value }))}
                    placeholder="예: 02-1234-5678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pet-gray/80 bg-white text-sm text-pet-dark-brown placeholder:text-pet-brown/30 focus:outline-none focus:border-pet-orange focus:ring-1 focus:ring-pet-orange/30 transition-all"
                  />
                </div>

                {/* 카테고리 */}
                <div>
                  <label className="block text-xs font-semibold text-pet-brown mb-1.5">카테고리</label>
                  <select
                    value={submitForm.category}
                    onChange={(e) => setSubmitForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pet-gray/80 bg-white text-sm text-pet-dark-brown focus:outline-none focus:border-pet-orange focus:ring-1 focus:ring-pet-orange/30 transition-all"
                  >
                    <option value="">카테고리 선택</option>
                    {submitCategories.map((cat) => (
                      <option key={cat.key} value={cat.key}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* 설명 */}
                <div>
                  <label className="block text-xs font-semibold text-pet-brown mb-1.5">설명</label>
                  <textarea
                    value={submitForm.description}
                    onChange={(e) => setSubmitForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="장소에 대한 설명을 입력해주세요 (반려동물 관련 정보 등)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pet-gray/80 bg-white text-sm text-pet-dark-brown placeholder:text-pet-brown/30 focus:outline-none focus:border-pet-orange focus:ring-1 focus:ring-pet-orange/30 transition-all resize-none h-24"
                  />
                </div>

                {/* 이미지 */}
                <div>
                  <label className="block text-xs font-semibold text-pet-brown mb-1.5">이미지</label>
                  {submitForm.imageUrl ? (
                    <div className="flex items-center gap-3">
                      <img src={submitForm.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover" />
                      <button type="button" onClick={() => setSubmitForm((f) => ({ ...f, imageUrl: '' }))} className="text-xs text-red-500 hover:underline">삭제</button>
                    </div>
                  ) : (
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-pet-cream text-pet-brown rounded-xl text-xs font-semibold cursor-pointer hover:bg-pet-peach transition-colors">
                      {submitImgUploading ? '업로드 중...' : '📷 사진 추가'}
                      <input type="file" accept="image/*" className="hidden" disabled={submitImgUploading} onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setSubmitImgUploading(true);
                        try {
                          const res = await uploadImages([file]);
                          const uploaded = res.data[0];
                          setSubmitForm((f) => ({ ...f, imageUrl: getImageUrl(uploaded.imageURL || uploaded.fileName) }));
                        } catch { alert('이미지 업로드 실패'); }
                        finally { setSubmitImgUploading(false); }
                      }} />
                    </label>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full py-3 bg-pet-orange text-white rounded-xl text-sm font-bold hover:bg-pet-orange/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      제보 중...
                    </>
                  ) : (
                    '장소 제보하기'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </>
    );
  };

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

    /* Build the image list: firstimage, firstimage2, then imageUrls (deduplicated) */
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
              key={`${placeDetail.id}-${currentImg}`}
              src={allImages[currentImg] || allImages[0]}
              alt={placeDetail.title}
              className="w-full h-52 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
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
              <p className="text-xs text-pet-brown mt-1">📍 {placeDetail.addr1}</p>
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
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[placeDetail.category] || categoryColors.OTHER}`}>
                {categoryLabels[placeDetail.category] || placeDetail.category}
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

          {/* ====================================================== */}
          {/*  NEW: Vote buttons (Feature 1) - below info, above     */}
          {/*  action buttons                                         */}
          {/* ====================================================== */}
          {renderVoteButtons()}

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
            <form onSubmit={handleReviewSubmit} className="mb-4 p-3 bg-pet-cream/80 rounded-xl">
              {!isAuthenticated && (
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="닉네임 (선택)"
                  maxLength={20}
                  className="w-full p-2 mb-2 rounded-lg border border-pet-gray/80 bg-white text-xs focus:outline-none focus:border-pet-orange transition-colors"
                />
              )}
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
                      {user?.email === review.writerEmail && (
                        <button
                          onClick={() => handleReviewDelete(review.id)}
                          className="text-[10px] text-pet-brown/40 hover:text-red-500 transition-colors px-1.5 py-0.5 rounded hover:bg-red-50"
                        >
                          삭제
                        </button>
                      )}
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
          {/* Mode toggle tabs */}
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
          {/* Desktop search bar inside sidebar */}
          <div className="mb-3">{renderSearchForm()}</div>
          {/* Desktop category pills */}
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

        {/* ============================================================ */}
        {/*  NEW: Popular ranking (Feature 3) + Recent submissions (4)    */}
        {/* ============================================================ */}
        {renderPopularRanking()}
        {renderRecentSubmissions()}

        {/* Place list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {listPlaces.length === 0 ? renderEmptyList() : listPlaces.map(renderPlaceCard)}
        </div>
      </div>

      {/* ================================================================ */}
      {/* MAP AREA                                                         */}
      {/* ================================================================ */}
      <div className="flex-1 relative">
        {/* Mobile-only search overlay */}
        {renderMobileSearchOverlay()}

        {/* Desktop auth overlay */}
        {renderDesktopAuthOverlay()}

        {/* GPS button */}
        {renderGpsButton()}

        {/* ============================================================ */}
        {/*  NEW: "장소 제보" floating button (Feature 2)                  */}
        {/* ============================================================ */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              alert('로그인이 필요합니다');
              return;
            }
            setSubmitModalOpen(true);
          }}
          className="absolute bottom-24 md:bottom-6 left-4 z-10 flex items-center gap-1.5 px-4 py-2.5 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-pet-gray/60 text-sm font-bold text-pet-orange"
          aria-label="장소 제보"
          title="새 장소 제보하기"
        >
          <span className="text-base">➕</span>
          <span className="hidden sm:inline">장소 제보</span>
        </button>

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

      {/* ================================================================ */}
      {/*  NEW: Submit place modal (Feature 2)                             */}
      {/* ================================================================ */}
      {renderSubmitModal()}

      {/* Inline keyframe animation for the submit modal */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%);
            opacity: 0.5;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (min-width: 768px) {
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0.5;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        }
      `}</style>
    </div>
  );
}
