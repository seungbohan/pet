import { Link } from 'react-router-dom';
import StarRating from '../common/StarRating';

export default function PlaceCard({ place, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selected
          ? 'border-pet-orange bg-pet-peach/30'
          : 'border-transparent bg-white hover:border-pet-peach'
      }`}
    >
      <div className="flex gap-3">
        {place.imageUrls?.[0] ? (
          <img
            src={place.imageUrls[0]}
            alt={place.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-pet-gray flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🐾</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm text-pet-dark-brown truncate">{place.title}</h3>
          <p className="text-xs text-pet-brown/60 truncate mt-0.5">{place.addr1}</p>
          {place.avgRating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <StarRating rating={Math.round(place.avgRating)} readOnly size="text-xs" />
              <span className="text-xs text-pet-brown/50">({place.reviewCount})</span>
            </div>
          )}
        </div>
      </div>
      <Link
        to={`/places/${place.id}`}
        className="block mt-2 text-center text-xs text-pet-orange font-medium hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        상세보기 →
      </Link>
    </div>
  );
}
