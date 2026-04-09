import { useState } from 'react';

/**
 * ImageGallery - Shared image gallery/carousel component
 *
 * @param {string[]} images     - Array of image URLs
 * @param {string}   alt        - Alt text for images
 * @param {string}   variant    - 'arrows' (MapPage sidebar) or 'thumbnails' (PlaceDetailPage)
 * @param {string}   className  - Additional wrapper classes
 */
export default function ImageGallery({ images = [], alt = '', variant = 'arrows', className = '' }) {
  const [currentImg, setCurrentImg] = useState(0);

  if (images.length === 0) {
    return (
      <div className={`w-full h-36 bg-gradient-to-br from-pet-peach to-pet-cream flex items-center justify-center ${variant === 'thumbnails' ? 'h-[200px] rounded-2xl' : ''} ${className}`}>
        <span className="text-5xl">🐾</span>
      </div>
    );
  }

  if (variant === 'thumbnails') {
    /* PlaceDetailPage style: large image + thumbnail strip */
    return (
      <div className={`rounded-2xl overflow-hidden ${className}`}>
        <img
          key={currentImg}
          src={images[currentImg] || images[0]}
          alt={alt}
          className="w-full h-[350px] object-cover"
        />
        {images.length > 1 && (
          <div className="flex gap-2 mt-2">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setCurrentImg(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  i === currentImg ? 'border-pet-orange' : 'border-transparent'
                }`}
              >
                <img src={url} alt={`${alt} 썸네일 ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* Default: 'arrows' variant - MapPage sidebar style with dots + arrow nav */
  return (
    <div className={`relative ${className}`}>
      <img
        key={currentImg}
        src={images[currentImg] || images[0]}
        alt={alt}
        className="w-full h-52 object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      {images.length > 1 && (
        <>
          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImg(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentImg ? 'bg-white w-4' : 'bg-white/50'
                }`}
                aria-label={`이미지 ${i + 1}`}
              />
            ))}
          </div>
          {/* Prev arrow */}
          {currentImg > 0 && (
            <button
              onClick={() => setCurrentImg((p) => p - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="이전 이미지"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {/* Next arrow */}
          {currentImg < images.length - 1 && (
            <button
              onClick={() => setCurrentImg((p) => p + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="다음 이미지"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
}
