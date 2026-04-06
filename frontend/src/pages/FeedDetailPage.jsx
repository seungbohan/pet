import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFeed, deleteFeed } from '../api/feed';
import { getFeedReviews, createFeedReview, deleteReview } from '../api/reviews';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import Pagination from '../components/common/Pagination';
import useAuthStore from '../store/authStore';

export default function FeedDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [feed, setFeed] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    getFeed(id)
      .then((res) => setFeed(res.data))
      .catch(() => navigate('/feeds'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    loadReviews();
  }, [id, reviewPage]);

  const loadReviews = () => {
    getFeedReviews(id, reviewPage)
      .then((res) => {
        setReviews(res.data.content || []);
        setReviewTotalPages(res.data.totalPages || 0);
      })
      .catch(() => {});
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteFeed(id);
      navigate('/feeds');
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    try {
      await createFeedReview(id, { content: newReview, rating: newRating });
      setNewReview('');
      setNewRating(5);
      loadReviews();
    } catch {
      alert('리뷰 작성에 실패했습니다.');
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;
    try {
      await deleteReview(reviewId);
      loadReviews();
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!feed) return null;

  const isOwner = user?.email === feed.writerEmail;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Image Carousel */}
      {feed.images?.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden mb-6 bg-pet-gray">
          <img
            src={`/api/v1/upload/display?fileName=${feed.images[currentImg]?.imageURL}`}
            alt={feed.title}
            className="w-full h-[400px] object-contain bg-black/5"
          />
          {feed.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {feed.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === currentImg ? 'bg-pet-orange' : 'bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feed Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-pet-dark-brown">{feed.title}</h1>
          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/feeds/write?edit=${id}`)}
                className="text-sm text-pet-brown hover:text-pet-orange"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="text-sm text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-pet-brown/60 mb-4">
          <span>{feed.writerName}</span>
          <span>&middot;</span>
          <span>{new Date(feed.regDate).toLocaleDateString('ko-KR')}</span>
          <span>&middot;</span>
          <span>&#x1F4AC; {feed.reviewCount}</span>
        </div>
        <div className="text-pet-brown leading-relaxed whitespace-pre-wrap">
          {feed.content}
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-pet-dark-brown mb-4">
          리뷰 ({feed.reviewCount})
        </h2>

        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-pet-cream rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-pet-brown">별점</span>
              <StarRating rating={newRating} onChange={setNewRating} size="text-lg" />
            </div>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="리뷰를 작성해주세요..."
              className="w-full p-3 rounded-xl border border-pet-gray bg-white text-sm resize-none h-20 focus:outline-none focus:border-pet-orange"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-pet-orange text-white rounded-xl text-sm font-medium hover:bg-pet-orange/90 transition-colors"
            >
              리뷰 작성
            </button>
          </form>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border border-pet-gray rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-pet-brown">{review.writerName}</span>
                  <StarRating rating={review.rating} readOnly size="text-sm" />
                </div>
                {user?.email === review.writerEmail && (
                  <button
                    onClick={() => handleReviewDelete(review.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="text-sm text-pet-brown/80">{review.content}</p>
              <span className="text-xs text-pet-brown/40 mt-1 block">
                {new Date(review.regDate).toLocaleDateString('ko-KR')}
              </span>
            </div>
          ))}
        </div>

        <Pagination page={reviewPage} totalPages={reviewTotalPages} onPageChange={setReviewPage} />
      </div>
    </div>
  );
}
