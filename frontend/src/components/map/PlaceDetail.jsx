import { Link } from 'react-router-dom';
import StarRating from '../common/StarRating';
import ReviewForm from '../reviews/ReviewForm';
import ReviewList from '../reviews/ReviewList';
import ImageGallery from '../reviews/ImageGallery';
import { categoryColors, categoryLabels } from '../../constants/categories';

/**
 * PlaceDetail - Place detail panel content
 *
 * Used by MapPage in both the desktop right panel and the mobile bottom sheet.
 * Displays images, place info, vote buttons, action buttons, and reviews.
 */
export default function PlaceDetail({
  placeDetail,
  detailLoading,
  selectedId,
  /* Image carousel */
  currentImg,
  setCurrentImg,
  /* Favorites */
  favorited,
  onFavorite,
  /* Votes */
  voteData,
  voteLoading,
  onVote,
  /* Reviews */
  reviews,
  reviewPage,
  setReviewPage,
  reviewTotalPages,
  onReviewSubmit,
  onReviewDelete,
  /* Review form */
  newReview,
  setNewReview,
  newRating,
  setNewRating,
  guestName,
  setGuestName,
  /* Auth */
  isAuthenticated,
  userEmail,
  /* Actions */
  onClose,
}) {
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

  /* Build deduplicated image list */
  const allImages = [];
  if (placeDetail.firstimage) allImages.push(placeDetail.firstimage);
  if (placeDetail.imageUrls?.length > 0) {
    placeDetail.imageUrls.forEach((url) => {
      if (!allImages.includes(url)) allImages.push(url);
    });
  }

  return (
    <div>
      {/* Image carousel */}
      <ImageGallery images={allImages} alt={placeDetail.title} variant="arrows" />

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
          {/* Close button - desktop only */}
          <button
            onClick={onClose}
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

        {/* Vote buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onVote(true)}
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
          <button
            onClick={() => onVote(false)}
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

        {/* Action buttons */}
        <div className="flex gap-2 mb-6">
          {isAuthenticated && (
            <button
              onClick={onFavorite}
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

          <ReviewForm
            onSubmit={onReviewSubmit}
            isAuthenticated={isAuthenticated}
            allowGuest={true}
            newReview={newReview}
            setNewReview={setNewReview}
            newRating={newRating}
            setNewRating={setNewRating}
            guestName={guestName}
            setGuestName={setGuestName}
            variant="compact"
          />

          <ReviewList
            reviews={reviews}
            currentUserEmail={userEmail}
            onDelete={onReviewDelete}
            variant="compact"
          />

          {/* Review pagination */}
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
}
