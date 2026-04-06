import { Link } from 'react-router-dom';

export default function FeedCard({ feed }) {
  const thumbnail = feed.images?.[0]?.thumbnailURL;
  const authorInitial = feed.writerName?.charAt(0) || '?';

  /* Derive a soft pastel avatar color from the author name */
  const avatarColors = [
    'bg-pet-pink text-pet-dark-brown',
    'bg-pet-mint text-pet-dark-brown',
    'bg-pet-sky text-pet-dark-brown',
    'bg-pet-yellow text-pet-dark-brown',
    'bg-pet-peach text-pet-dark-brown',
  ];
  const colorIdx = (feed.writerName || '').length % avatarColors.length;
  const avatarColor = avatarColors[colorIdx];

  return (
    <Link to={`/feeds/${feed.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* --- Image area --- */}
        <div className="relative aspect-[4/3] overflow-hidden bg-pet-gray">
          {thumbnail ? (
            <img
              src={`/api/v1/upload/display?fileName=${thumbnail}`}
              alt={feed.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pet-peach via-pet-pink/30 to-pet-cream flex items-center justify-center">
              <span className="text-5xl drop-shadow-sm select-none">&#x1F43E;</span>
            </div>
          )}

          {/* Gradient overlay at bottom of image for text contrast */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          {/* Category / tag badge */}
          {feed.category && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white/90 backdrop-blur text-pet-dark-brown shadow-sm">
              {feed.category}
            </span>
          )}

          {/* Title overlaid on image bottom */}
          <h3 className="absolute bottom-3 left-3 right-3 font-bold text-white text-sm line-clamp-1 drop-shadow-md">
            {feed.title}
          </h3>
        </div>

        {/* --- Content area --- */}
        <div className="p-4">
          {/* Snippet */}
          <p className="text-xs text-pet-brown/60 line-clamp-2 mb-3 leading-relaxed">
            {feed.content}
          </p>

          {/* Author + meta row */}
          <div className="flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor} ring-2 ring-white shadow-sm`}
              >
                {authorInitial}
              </div>
              <span className="text-xs font-medium text-pet-brown/70 truncate max-w-[100px]">
                {feed.writerName}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-pet-brown/50">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {feed.reviewCount ?? 0}
              </span>
              {feed.likeCount !== undefined && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {feed.likeCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
