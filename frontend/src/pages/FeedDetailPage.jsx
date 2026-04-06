import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFeed, deleteFeed } from '../api/feed';
import { getFeedReviews, createFeedReview, deleteReview } from '../api/reviews';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import Pagination from '../components/common/Pagination';
import SEOHead from '../components/common/SEOHead';
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
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReviewDeleteConfirm, setShowReviewDeleteConfirm] = useState(null);

  useEffect(() => {
    getFeed(id)
      .then((res) => setFeed(res.data))
      .catch(() => navigate('/feeds'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const loadReviews = useCallback(() => {
    getFeedReviews(id, reviewPage)
      .then((res) => {
        setReviews(res.data.content || []);
        setReviewTotalPages(res.data.totalPages || 0);
      })
      .catch(() => {});
  }, [id, reviewPage]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleDelete = async () => {
    try {
      await deleteFeed(id);
      navigate('/feeds');
    } catch {
      alert('삭제에 실패했습니다.');
    }
    setShowDeleteConfirm(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    setReviewSubmitting(true);
    try {
      await createFeedReview(id, { content: newReview, rating: newRating });
      setNewReview('');
      setNewRating(5);
      loadReviews();
    } catch {
      alert('리뷰 작성에 실패했습니다.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      loadReviews();
    } catch {
      alert('삭제에 실패했습니다.');
    }
    setShowReviewDeleteConfirm(null);
  };

  const handlePrevImg = () => {
    setImgLoaded(false);
    setCurrentImg((prev) => (prev > 0 ? prev - 1 : feed.images.length - 1));
  };

  const handleNextImg = () => {
    setImgLoaded(false);
    setCurrentImg((prev) => (prev < feed.images.length - 1 ? prev + 1 : 0));
  };

  if (loading) return <LoadingSpinner />;
  if (!feed) return null;

  const isOwner = user?.email === feed.writerEmail;

  return (
    <div className="min-h-screen pb-24">
      <SEOHead
        title={feed.title}
        description={feed.content?.substring(0, 155) || `${feed.title} - 위드펫 커뮤니티 피드`}
        path={`/feeds/${id}`}
        image={feed.images?.[0]?.imageURL ? `/api/v1/upload/display?fileName=${feed.images[0].imageURL}` : undefined}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: feed.title,
          description: feed.content?.substring(0, 155),
          author: { '@type': 'Person', name: feed.writerNickname || feed.writerEmail },
          publisher: { '@type': 'Organization', name: '위드펫', url: 'https://withpet.shop/' },
          datePublished: feed.createdAt,
          dateModified: feed.updatedAt || feed.createdAt,
          mainEntityOfPage: `https://withpet.shop/feeds/${id}`,
        }}
      />
      {/* Full-width Image Carousel */}
      {feed.images?.length > 0 && (
        <div className="relative w-full bg-black/5 overflow-hidden" style={{ maxHeight: '480px' }}>
          {/* Image */}
          <div className="relative w-full flex items-center justify-center bg-gradient-to-b from-pet-gray to-white"
               style={{ minHeight: '320px', maxHeight: '480px' }}>
            <img
              src={`/api/v1/upload/display?fileName=${feed.images[currentImg]?.imageURL}`}
              alt={feed.title}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-contain max-h-[480px] transition-opacity duration-500 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-pet-orange/30 border-t-pet-orange rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {feed.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-pet-brown hover:bg-white hover:scale-105 transition-all"
                aria-label="이전 이미지"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-pet-brown hover:bg-white hover:scale-105 transition-all"
                aria-label="다음 이미지"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {feed.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full">
              {feed.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setImgLoaded(false); setCurrentImg(i); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentImg
                      ? 'w-6 h-2.5 bg-white'
                      : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`이미지 ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Image Counter Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {currentImg + 1} / {feed.images.length}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4">
        {/* Author Info Card */}
        <div className="relative -mt-6 z-10 bg-white rounded-2xl p-5 shadow-md mb-5 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            {/* Author Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pet-orange to-pet-peach flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
              {feed.writerName?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-pet-dark-brown text-sm">{feed.writerName}</h3>
              <div className="flex items-center gap-2 text-xs text-pet-brown/50">
                <time>{new Date(feed.regDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                <span className="w-1 h-1 rounded-full bg-pet-brown/30" />
                <span>리뷰 {feed.reviewCount}개</span>
              </div>
            </div>
            {isOwner && (
              <div className="flex gap-1">
                <button
                  onClick={() => navigate(`/feeds/write?edit=${id}`)}
                  className="px-3 py-1.5 text-xs font-medium text-pet-brown bg-pet-gray rounded-lg hover:bg-pet-peach transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-pet-dark-brown leading-snug mb-4 font-heading">
            {feed.title}
          </h1>

          {/* Content */}
          <div className="text-pet-brown leading-7 whitespace-pre-wrap text-[15px]">
            {feed.content}
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
          {/* Review Header */}
          <div className="px-5 py-4 border-b border-pet-gray/50 flex items-center gap-2">
            <svg className="w-5 h-5 text-pet-orange" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
            </svg>
            <h2 className="text-lg font-bold text-pet-dark-brown">
              리뷰 <span className="text-pet-orange">{feed.reviewCount}</span>
            </h2>
          </div>

          {/* Review Write Form */}
          {isAuthenticated && (
            <form onSubmit={handleReviewSubmit} className="px-5 py-4 bg-gradient-to-r from-pet-cream to-pet-peach/20 border-b border-pet-gray/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pet-orange to-pet-pink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user?.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-pet-dark-brown">{user?.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-pet-brown/60">별점</span>
                    <StarRating rating={newRating} onChange={setNewRating} size="text-base" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="리뷰를 작성해주세요..."
                  maxLength={500}
                  className="w-full p-3 pr-20 rounded-xl border border-pet-gray/60 bg-white text-sm resize-none h-20 focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/10 transition-all placeholder:text-pet-brown/30"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className="text-xs text-pet-brown/40">{newReview.length}/500</span>
                  <button
                    type="submit"
                    disabled={reviewSubmitting || !newReview.trim()}
                    className="px-4 py-1.5 bg-pet-orange text-white rounded-lg text-xs font-semibold hover:bg-pet-orange/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {reviewSubmitting ? (
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        전송 중
                      </span>
                    ) : '작성'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="divide-y divide-pet-gray/30">
            {reviews.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-pet-gray flex items-center justify-center">
                  <svg className="w-8 h-8 text-pet-brown/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-pet-brown/50">아직 리뷰가 없습니다</p>
                <p className="text-xs text-pet-brown/30 mt-1">첫 번째 리뷰를 남겨보세요</p>
              </div>
            ) : (
              reviews.map((review, idx) => (
                <div
                  key={review.id}
                  className="px-5 py-4 hover:bg-pet-cream/30 transition-colors animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    {/* Reviewer Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pet-sky to-pet-mint flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">
                      {review.writerName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-pet-dark-brown">{review.writerName}</span>
                          <StarRating rating={review.rating} readOnly size="text-xs" />
                        </div>
                        {user?.email === review.writerEmail && (
                          <button
                            onClick={() => setShowReviewDeleteConfirm(review.id)}
                            className="text-xs text-pet-brown/40 hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-pet-brown/80 mt-1.5 leading-relaxed">{review.content}</p>
                      <time className="text-xs text-pet-brown/35 mt-2 block">
                        {new Date(review.regDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="px-5 pb-4">
            <Pagination page={reviewPage} totalPages={reviewTotalPages} onPageChange={setReviewPage} />
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white/90 backdrop-blur-md border-t border-pet-gray/40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => navigate('/feeds')}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-pet-brown hover:text-pet-dark-brown hover:bg-pet-gray rounded-xl transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              목록으로
            </button>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-pet-cream rounded-xl">
                <svg className="w-4 h-4 text-pet-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
                </svg>
                <span className="text-sm font-semibold text-pet-brown">{feed.reviewCount}</span>
              </div>
              {isAuthenticated && !isOwner && (
                <a
                  href="#review-form"
                  className="px-5 py-2.5 bg-gradient-to-r from-pet-orange to-pet-pink text-white rounded-xl text-sm font-semibold shadow-md shadow-pet-orange/20 hover:shadow-lg hover:shadow-pet-orange/30 hover:-translate-y-0.5 transition-all"
                >
                  리뷰 쓰기
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-pet-dark-brown text-center mb-2">피드를 삭제하시겠습니까?</h3>
            <p className="text-sm text-pet-brown/60 text-center mb-6">삭제된 피드는 복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 bg-pet-gray text-pet-brown rounded-xl font-medium hover:bg-pet-peach transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Delete Confirmation Modal */}
      {showReviewDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={() => setShowReviewDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-pet-dark-brown text-center mb-2">리뷰를 삭제하시겠습니까?</h3>
            <p className="text-sm text-pet-brown/60 text-center mb-6">삭제된 리뷰는 복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-pet-gray text-pet-brown rounded-xl font-medium hover:bg-pet-peach transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleReviewDelete(showReviewDeleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
