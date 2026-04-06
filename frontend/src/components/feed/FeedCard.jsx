import { Link } from 'react-router-dom';

export default function FeedCard({ feed }) {
  const thumbnail = feed.images?.[0]?.thumbnailURL;

  return (
    <Link to={`/feeds/${feed.id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-200">
        {thumbnail ? (
          <div className="aspect-[4/3] bg-pet-gray">
            <img
              src={`/api/v1/upload/display?fileName=${thumbnail}`}
              alt={feed.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-gradient-to-br from-pet-peach to-pet-cream flex items-center justify-center">
            <span className="text-4xl">&#x1F43E;</span>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-pet-dark-brown text-sm line-clamp-1 mb-1">
            {feed.title}
          </h3>
          <p className="text-xs text-pet-brown/60 line-clamp-2 mb-3">
            {feed.content}
          </p>
          <div className="flex items-center justify-between text-xs text-pet-brown/50">
            <span>{feed.writerName}</span>
            <div className="flex items-center gap-2">
              <span>&#x1F4AC; {feed.reviewCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
