import { useState } from 'react';

/**
 * timeAgo - Converts a date string to a relative time string (Korean)
 */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}일 전`;
  return then.toLocaleDateString('ko-KR');
}

/**
 * RecentSubmissions - Collapsible recent place submissions section
 *
 * @param {Array} submissions - Array of recent submission objects
 */
export default function RecentSubmissions({ submissions = [] }) {
  const [open, setOpen] = useState(true);

  if (submissions.length === 0) return null;

  return (
    <div className="border-b border-pet-gray/40">
      {/* Collapsible header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-pet-cream/40 transition-colors"
      >
        <h3 className="text-sm font-bold text-pet-dark-brown flex items-center gap-1.5">
          <span>📌</span> 최근 제보
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

      {/* Submissions list */}
      {open && (
        <div className="px-2 pb-2 space-y-0.5">
          {submissions.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-pet-cream/80 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-pet-dark-brown truncate">{item.title}</h4>
                  {item.status === 'APPROVED' ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-green-100 text-green-700 flex-shrink-0">
                      승인
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-yellow-100 text-yellow-700 flex-shrink-0">
                      대기중
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {item.submitterName && (
                    <span className="text-[10px] text-pet-brown/50">{item.submitterName}</span>
                  )}
                  {item.createdAt && (
                    <span className="text-[10px] text-pet-brown/30">{timeAgo(item.createdAt)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
