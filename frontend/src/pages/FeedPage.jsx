import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeeds, getPopularFeeds } from '../api/feed';
import FeedList from '../components/feed/FeedList';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/authStore';

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
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-pet-dark-brown">&#x1F43E; 펫 피드</h1>
          <p className="text-sm text-pet-brown/60 mt-1">반려동물과의 일상을 나눠보세요</p>
        </div>
        {isAuthenticated && (
          <Link
            to="/feeds/write"
            className="px-5 py-2.5 bg-pet-orange text-white rounded-xl font-semibold hover:bg-pet-orange/90 transition-colors"
          >
            &#x270F;&#xFE0F; 글쓰기
          </Link>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {['recent', 'popular'].map((t) => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-pet-orange text-white'
                : 'bg-white text-pet-brown hover:bg-pet-peach'
            }`}
          >
            {t === 'recent' ? '최신' : '인기'}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : <FeedList feeds={feeds} />}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
