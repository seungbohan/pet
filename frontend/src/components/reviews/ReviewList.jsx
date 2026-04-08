import StarRating from '../common/StarRating';

/**
 * ReviewList - Shared review list component
 *
 * @param {Array}    reviews          - Array of review objects
 * @param {string}   currentUserEmail - Current user's email (for delete button)
 * @param {function} onDelete         - Called with reviewId when delete is clicked
 * @param {string}   variant          - 'compact' (MapPage) or 'full' (PlaceDetailPage)
 */
export default function ReviewList({
  reviews = [],
  currentUserEmail,
  onDelete,
  variant = 'compact',
}) {
  if (reviews.length === 0) {
    return (
      <p className={`text-center py-4 ${variant === 'compact' ? 'text-xs text-pet-brown/40' : 'text-sm text-pet-brown/50'}`}>
        아직 리뷰가 없습니다
      </p>
    );
  }

  if (variant === 'full') {
    /* PlaceDetailPage style */
    return (
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 border border-pet-gray rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm text-pet-brown">{review.writerName}</span>
              <StarRating rating={review.rating} readOnly size="text-sm" />
              <span className="text-xs text-pet-brown/40 ml-auto">
                {new Date(review.regDate).toLocaleDateString('ko-KR')}
              </span>
              {currentUserEmail === review.writerEmail && (
                <button
                  onClick={() => onDelete(review.id)}
                  className="text-xs text-pet-brown/40 hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                >
                  삭제
                </button>
              )}
            </div>
            <p className="text-sm text-pet-brown/80">{review.content}</p>
            {review.tags?.length > 0 && (
              <div className="flex gap-1 mt-2">
                {review.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-pet-mint text-pet-dark-brown rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  /* Default: 'compact' variant for MapPage sidebar */
  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="p-3 border border-pet-gray/80 rounded-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-semibold text-xs text-pet-brown">{review.writerName}</span>
            <StarRating rating={review.rating} readOnly size="text-xs" />
            <span className="text-[10px] text-pet-brown/40 ml-auto">
              {new Date(review.regDate).toLocaleDateString('ko-KR')}
            </span>
            {currentUserEmail === review.writerEmail && (
              <button
                onClick={() => onDelete(review.id)}
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
      ))}
    </div>
  );
}
