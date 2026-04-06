import { useState } from 'react';

export default function StarRating({ rating = 0, onChange, readOnly = false, size = 'text-xl' }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          className={`${size} transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <span className={(hover || rating) >= star ? 'text-pet-yellow' : 'text-gray-300'}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
