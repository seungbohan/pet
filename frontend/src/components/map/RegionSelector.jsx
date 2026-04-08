import { useState, useEffect, useRef } from 'react';
import { regions } from '../../constants/regions';

/**
 * RegionSelector - Region filter dropdown (mobile) and button rows (desktop sidebar)
 *
 * @param {string}   areacode  - Currently selected region code
 * @param {function} onChange  - Called with new region code
 * @param {string}   variant   - 'dropdown' (mobile overlay) or 'buttons' (desktop sidebar)
 */
export default function RegionSelector({ areacode, onChange, variant = 'dropdown' }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLabel = regions.find((r) => r.code === areacode)?.label || '지역';

  /* Close on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    onChange(code);
    setDropdownOpen(false);
  };

  if (variant === 'buttons') {
    /* Desktop sidebar: two rows of region pill buttons */
    return (
      <>
        <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {regions.slice(0, 9).map((region) => (
            <button
              key={region.code}
              onClick={() => onChange(region.code)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
                areacode === region.code
                  ? 'bg-pet-orange text-white'
                  : 'bg-pet-gray text-pet-brown/70 hover:bg-pet-peach/50'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
        <div className="mt-1 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {regions.slice(9).map((region) => (
            <button
              key={region.code}
              onClick={() => onChange(region.code)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
                areacode === region.code
                  ? 'bg-pet-orange text-white'
                  : 'bg-pet-gray text-pet-brown/70 hover:bg-pet-peach/50'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      </>
    );
  }

  /* Default: 'dropdown' variant */
  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shadow-sm border ${
          areacode
            ? 'bg-pet-orange text-white border-pet-orange shadow-pet-orange/30'
            : 'bg-white/90 backdrop-blur-lg text-pet-brown border-transparent hover:bg-white'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{selectedLabel}</span>
        <svg className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-pet-gray/60 py-1.5 z-50 max-h-64 overflow-y-auto">
          {regions.map((region) => (
            <button
              key={region.code}
              onClick={() => handleSelect(region.code)}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                areacode === region.code
                  ? 'bg-pet-orange/10 text-pet-orange font-bold'
                  : 'text-pet-brown hover:bg-pet-cream/80'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
