import { useState } from 'react';
import { categoryColors, categoryLabels } from '../../constants/categories';

const rankColors = {
  1: 'text-yellow-500',   // gold
  2: 'text-gray-400',     // silver
  3: 'text-amber-600',    // bronze
};

/**
 * PopularRanking - Collapsible popular places ranking section
 *
 * @param {Array}    places      - Sorted list of popular places
 * @param {number}   selectedId  - Currently selected place ID
 * @param {function} onPlaceClick - Called with place ID on click
 */
export default function PopularRanking({ places = [], selectedId, onPlaceClick }) {
  const [open, setOpen] = useState(true);

  if (places.length === 0) return null;

  return (
    <div className="border-b border-pet-gray/40">
      {/* Collapsible header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-pet-cream/40 transition-colors"
      >
        <h3 className="text-sm font-bold text-pet-dark-brown flex items-center gap-1.5">
          <span>🏆</span> 인기 장소
        </h3>
        <svg
          className={`w-4 h-4 text-pet-brown/50 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Ranking list */}
      {open && (
        <div className="px-2 pb-2 space-y-0.5">
          {places.map((place, index) => {
            const rank = index + 1;
            const medalColor = rankColors[rank] || 'text-pet-brown/50';

            return (
              <div
                key={place.id}
                onClick={() => onPlaceClick(place.id)}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                  selectedId === place.id
                    ? 'bg-pet-orange/10'
                    : 'hover:bg-pet-cream/80'
                }`}
              >
                {/* Rank number */}
                <span className={`w-5 text-center font-extrabold text-sm ${medalColor}`}>
                  {rank}
                </span>

                {/* Place info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-pet-dark-brown truncate">{place.title}</h4>
                    <span className="flex items-center gap-0.5 text-[10px] text-green-600 font-semibold flex-shrink-0">
                      👍 {place.upvotes || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {place.category && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${categoryColors[place.category] || categoryColors.OTHER}`}>
                        {categoryLabels[place.category] || place.category}
                      </span>
                    )}
                    {place.addr1 && (
                      <span className="text-[10px] text-pet-brown/70 truncate">
                        {place.addr1.split(' ').slice(0, 2).join(' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
