import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeeds, getPopularFeeds, searchFeeds } from '../api/feed';
import FeedList from '../components/feed/FeedList';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHead from '../components/common/SEOHead';
import useAuthStore from '../store/authStore';

const TABS = [
  { key: 'recent', label: '최신', icon: '&#x1F195;' },
  { key: 'popular', label: '인기', icon: '&#x1F525;' },
];

export default function FeedPage() {
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [tab, setTab] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    let fetcher;
    if (activeSearch) {
      fetcher = searchFeeds(activeSearch, page, 12);
    } else {
      fetcher = tab === 'recent' ? getFeeds(page, 12) : getPopularFeeds(page, 12);
    }
    fetcher
      .then((res) => {
        setFeeds(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => setFeeds([]))
      .finally(() => setLoading(false));
  }, [page, tab, activeSearch]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setPage(0);
    setActiveSearch('');
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setActiveSearch(searchQuery.trim());
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="반려동물 피드 - 반려인 커뮤니티"
        description="반려동물과 함께한 일상을 공유하고, 다른 반려인들의 후기와 추천 장소를 확인하세요. 위드펫 커뮤니티 피드입니다."
        path="/feeds"
      />
      {/* ---- Page header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pet-orange via-pet-pink to-pet-orange bg-clip-text text-transparent leading-tight">
            Pet Feed
          </h1>
          <p className="text-sm text-pet-brown/60 mt-1.5">
            반려동물과의 일상을 나눠보세요
          </p>
        </div>

        {/* Desktop write button */}
        {isAuthenticated && (
          <Link
            to="/feeds/write"
            className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pet-orange to-pet-orange/85 text-white rounded-full font-semibold shadow-md shadow-pet-orange/25 hover:shadow-lg hover:shadow-pet-orange/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            글쓰기
          </Link>
        )}
      </div>

      {/* ---- Tabs + Search ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                tab === t.key && !activeSearch
                  ? 'bg-pet-orange text-white shadow-md shadow-pet-orange/25'
                  : 'text-pet-brown/60 hover:text-pet-brown hover:bg-pet-cream'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="피드 검색..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-white border border-pet-gray/60 text-sm focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/20 transition-all"
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pet-brown/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {activeSearch && (
            <button type="button" onClick={clearSearch} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-pet-brown/40 hover:text-pet-brown">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </form>
      </div>
      {activeSearch && (
        <p className="text-sm text-pet-brown/60 mb-4">&quot;{activeSearch}&quot; 검색 결과</p>
      )}

      {/* ---- Feed grid or empty state ---- */}
      {loading ? (
        <LoadingSpinner />
      ) : feeds.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-7xl mb-4 animate-bounce">&#x1F43E;</div>
          <h2 className="text-xl font-bold text-pet-dark-brown mb-2">
            아직 게시글이 없어요
          </h2>
          <p className="text-sm text-pet-brown/50 mb-6 max-w-xs">
            첫 번째 게시글을 작성하고 반려동물과의 일상을 공유해보세요!
          </p>
          {isAuthenticated && (
            <Link
              to="/feeds/write"
              className="px-6 py-2.5 bg-pet-orange text-white rounded-full font-semibold shadow-md shadow-pet-orange/25 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              첫 글쓰기
            </Link>
          )}
        </div>
      ) : (
        <FeedList feeds={feeds} />
      )}

      {/* ---- Pagination ---- */}
      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* ---- Floating Action Button (mobile) ---- */}
      {isAuthenticated && (
        <Link
          to="/feeds/write"
          className="sm:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-pet-orange to-pet-pink text-white rounded-full shadow-xl shadow-pet-orange/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 animate-[pulse_3s_ease-in-out_infinite]"
          aria-label="글쓰기"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      )}
    </div>
  );
}
