import StarRating from '../common/StarRating';

/**
 * ReviewForm - Shared review submission form
 *
 * @param {function} onSubmit        - Form submit handler (receives event)
 * @param {boolean}  isAuthenticated - Whether user is logged in
 * @param {boolean}  allowGuest      - Show guest name field when not authenticated
 * @param {string}   newReview       - Current review text
 * @param {function} setNewReview    - Review text setter
 * @param {number}   newRating       - Current rating (1-5)
 * @param {function} setNewRating    - Rating setter
 * @param {string}   guestName       - Guest nickname (only used when allowGuest=true)
 * @param {function} setGuestName    - Guest name setter
 * @param {string}   variant         - 'compact' (MapPage sidebar) or 'full' (PlaceDetailPage)
 */
export default function ReviewForm({
  onSubmit,
  isAuthenticated,
  allowGuest = false,
  newReview,
  setNewReview,
  newRating,
  setNewRating,
  guestName,
  setGuestName,
  variant = 'compact',
}) {
  if (variant === 'full' && !isAuthenticated) {
    /* PlaceDetailPage: show login prompt when not authenticated */
    return (
      <div className="mb-6 p-4 bg-pet-cream rounded-xl text-center">
        <p className="text-sm text-pet-brown/70 mb-2">리뷰를 작성하려면 회원가입이 필요합니다.</p>
        <a
          href="/login"
          className="inline-block px-4 py-2 bg-pet-orange text-white rounded-xl text-sm font-medium hover:bg-pet-orange/90 transition-colors"
        >
          로그인 / 회원가입
        </a>
      </div>
    );
  }

  if (variant === 'full') {
    /* PlaceDetailPage: larger form */
    return (
      <form onSubmit={onSubmit} className="mb-6 p-4 bg-pet-cream rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-pet-brown">별점</span>
          <StarRating rating={newRating} onChange={setNewRating} size="text-lg" />
        </div>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="방문 후기를 남겨주세요..."
          className="w-full p-3 rounded-xl border border-pet-gray bg-white text-sm resize-none h-20 focus:outline-none focus:border-pet-orange"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-pet-orange text-white rounded-xl text-sm font-medium hover:bg-pet-orange/90 transition-colors"
        >
          리뷰 작성
        </button>
      </form>
    );
  }

  /* Default: 'compact' variant for MapPage sidebar */
  return (
    <form onSubmit={onSubmit} className="mb-4 p-3 bg-pet-cream/80 rounded-xl">
      {allowGuest && !isAuthenticated && (
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
  );
}
