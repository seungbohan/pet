/**
 * Skeleton loading components with shimmer animation.
 * Uses the existing animate-shimmer class defined in index.css.
 */

/* ------------------------------------------------------------------ */
/*  Base Skeleton — configurable shape                                 */
/* ------------------------------------------------------------------ */
export function Skeleton({ width, height, rounded = 'rounded-lg', className = '' }) {
  return (
    <div
      className={`bg-pet-gray animate-shimmer ${rounded} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  PlaceCardSkeleton — sidebar place list card                        */
/* ------------------------------------------------------------------ */
export function PlaceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse-soft" aria-hidden="true">
      <div className="flex gap-3">
        {/* Image placeholder */}
        <div className="w-20 h-20 rounded-xl bg-pet-gray animate-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2.5 py-1">
          {/* Title */}
          <div className="h-4 bg-pet-gray animate-shimmer rounded-md w-3/4" />
          {/* Address */}
          <div className="h-3 bg-pet-gray animate-shimmer rounded-md w-full" />
          {/* Rating + category */}
          <div className="flex gap-2">
            <div className="h-3 bg-pet-gray animate-shimmer rounded-md w-16" />
            <div className="h-3 bg-pet-gray animate-shimmer rounded-full w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FeedCardSkeleton — feed grid card                                  */
/* ------------------------------------------------------------------ */
export function FeedCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm" aria-hidden="true">
      {/* Image area */}
      <div className="aspect-[4/3] bg-pet-gray animate-shimmer" />
      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-pet-gray animate-shimmer rounded-md w-4/5" />
        {/* Snippet */}
        <div className="space-y-1.5">
          <div className="h-3 bg-pet-gray animate-shimmer rounded-md w-full" />
          <div className="h-3 bg-pet-gray animate-shimmer rounded-md w-2/3" />
        </div>
        {/* Author row */}
        <div className="flex items-center gap-2 pt-1">
          <div className="w-7 h-7 rounded-full bg-pet-gray animate-shimmer" />
          <div className="h-3 bg-pet-gray animate-shimmer rounded-md w-20" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DetailSkeleton — place / feed detail page                          */
/* ------------------------------------------------------------------ */
export function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4" aria-hidden="true">
      {/* Image area */}
      <div className="w-full h-[350px] bg-pet-gray animate-shimmer rounded-2xl mb-6" />

      {/* Info card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 space-y-4">
        <div className="h-7 bg-pet-gray animate-shimmer rounded-lg w-1/2" />
        <div className="h-4 bg-pet-gray animate-shimmer rounded-md w-3/4" />
        <div className="flex gap-3">
          <div className="h-4 bg-pet-gray animate-shimmer rounded-md w-24" />
          <div className="h-4 bg-pet-gray animate-shimmer rounded-full w-16" />
        </div>
      </div>

      {/* Reviews area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-pet-gray animate-shimmer rounded-md w-20" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-pet-gray/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pet-gray animate-shimmer" />
              <div className="h-3 bg-pet-gray animate-shimmer rounded-md w-20" />
            </div>
            <div className="h-3 bg-pet-gray animate-shimmer rounded-md w-full" />
            <div className="h-3 bg-pet-gray animate-shimmer rounded-md w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
