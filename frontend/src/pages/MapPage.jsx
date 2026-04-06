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
    getPlaces({ page: 0, size: 50, category: category || undefined, keyword: keyword || undefined })
      .then((res) => setListPlaces(res.data.content || []))
      .catch(() => setListPlaces([]));
  }, [category, keyword]);

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

  /* ---------------------------------------------------------------- */
  /*  Sub-renders                                                      */
  /* ---------------------------------------------------------------- */

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

      {/* Category pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
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

  /** Place list card (used in sidebar and bottom sheet) */
  const renderPlaceCard = (place) => (
    <div
      key={place.id}
      onClick={() => handlePlaceClick(place.id)}
      className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        selectedId === place.id
          ? 'bg-pet-orange/8 border-l-[3px] border-pet-orange'
          : 'hover:bg-pet-cream/80 border-l-[3px] border-transparent'
      }`}
    >
      {place.imageUrls?.[0] ? (
        <img
          src={place.imageUrls[0]}
          alt={place.title}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pet-peach to-pet-cream flex items-center justify-center flex-shrink-0">
          <span className="text-lg">🐾</span>
        </div>
      )}
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

    return (
      <div>
        {/* Image carousel */}
        {placeDetail.imageUrls?.length > 0 ? (
          <div className="relative">
            <img
              src={placeDetail.imageUrls[currentImg]}
              alt={placeDetail.title}
              className="w-full h-52 object-cover"
            />
            {placeDetail.imageUrls.length > 1 && (
              <>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {placeDetail.imageUrls.map((_, i) => (
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
                {currentImg < placeDetail.imageUrls.length - 1 && (
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
            <span className="text-5xl">📍</span>
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
