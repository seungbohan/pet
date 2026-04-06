import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeeds, getPopularFeeds } from '../api/feed';
import FeedList from '../components/feed/FeedList';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
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
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const fetcher = tab === 'recent' ? getFeeds : getPopularFeeds;
    fetcher(page, 12)
      .then((res) => {
        setFeeds(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => setFeeds([]))
      .finally(() => setLoading(false));
  }, [page, tab]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
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

      {/* ---- Pill tabs ---- */}
      <div className="flex gap-2 mb-8">
        <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                tab === t.key
                  ? 'bg-pet-orange text-white shadow-md shadow-pet-orange/25'
                  : 'text-pet-brown/60 hover:text-pet-brown hover:bg-pet-cream'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

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
